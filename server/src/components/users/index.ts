import * as bcrypt from "bcrypt";
import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import UserModel from "./userModel";
import BaseModel from "../base/baseModel";
import {Collection, Model} from "bookshelf";
import sendEmail from "../../util/sendEmail";
import Mustache = require("mustache");
import * as fs from "fs";
import {promisify} from "util";
import UserActivationModel from "./userActivationModel";
import PasswordResetModel from "../reset-password/passwordResetModel";
import * as moment from "moment";

// Convert the filesystem stuff to be promises
const readFile = promisify(fs.readFile);

export default class UsersController {

	public async getUsers(): Promise<void | Collection<Model<UserModel>>> {
		const usersCollection = await UserModel
			.fetchAll()
			.catch(handleDatabaseErrors);
		return usersCollection;
	}

	public async getUser(id: string): Promise<UserModel> {
		if (!Validator.isUUID(id, "4")) {
			throw new Error("Invalid ID");
		}
		const user = await new UserModel()
			.where({id})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
	}

	public async getUserByEmail(email: string): Promise<UserModel> {
		if (!Validator.isEmail(email)) {
			throw new Error("Invalid Email");
		}
		const user = await new UserModel()
			.where({email})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
	}

	public async getUserActivationByToken(token: string): Promise<UserActivationModel> {
		const userActivation = await new UserActivationModel()
			.where({token})
			.fetch({withRelated: ["user"]})
			.catch(handleDatabaseErrors);
		return userActivation;
	}

	public async createUser(data: any): Promise<BaseModel | void> {
		// const requiredFields = ["password", "name", "email"];
		// const missingRequired = validation.checkRequiredFields(requiredFields, data);
		// if (missingRequired.length > 0) {
			// throw new ValidationError(ValidationError.types.MISSING_REQUIRED_FIELDS, missingRequired.toString());
		// }

		if (!Validator.isEmail(data.email)) {
			throw new Error("email");
		}

		// make sure the email address isn't already used
		const existingUser = await new UserModel()
			.where({email: data.email})
			.fetch()
			.catch(handleDatabaseErrors);
		if (existingUser) {
			throw new Error("email is not unique");
		}

		await bcrypt.hash(data.password, 10)
			.then((hash) => {data.password = hash; });

		// All users are created as not admin
		data.is_admin = false;

		const user = await new UserModel(data)
			.save()
			.catch(handleDatabaseErrors);

		const userActivation = await this.createUserActivation(user.id);

		// send activation email
		await this.sendActivationEmail(userActivation);

		return user;
	}

	public async createUserActivation(userId: number): Promise<UserActivationModel> {
		const userActivation = await new UserActivationModel({user_id: userId})
			.save()
			.catch(handleDatabaseErrors);
		return userActivation;
	}

	public async resendActivationEmail(email: string): Promise<UserModel> {
		const user = await this.getUserByEmail(email);
		if (!user) {
			throw new Error("User does not exist");
		}
		if (user.get("activated") === true) {
			throw new Error("User already activated");
		}

		// delete any existing activation tokens
		const oldUserActivation = await new UserActivationModel()
			.where({user_id : user.id})
			.destroy({require: false})
			.catch(handleDatabaseErrors);

		const userActivation = await this.createUserActivation(user.id);
		await this.sendActivationEmail(userActivation);

		return user;
	}

	public async activateUser(token: string): Promise<any> {
		const userActivation = await this.getUserActivationByToken(token);
		if (!userActivation) {
			throw new Error("Token is not valid");
		}

		const user = userActivation.related("user") as UserModel;
		if (!user) {
			throw new Error("Token is not valid");
		}

		if (user.get("activated") === true) {
			throw new Error("User already activated");
		}

		const isExpired = moment(userActivation.get("created_at")).isBefore(moment().subtract(24, "hours"));
		if (isExpired) {
			throw new Error("Activation token has expired");
		}
		user.set({activated: true}).save();

		userActivation
			.destroy()
			.catch(handleDatabaseErrors);

		return {
			isValid: true,
			user,
			userActivation,
		};
	}

	public async sendActivationEmail(userActivation: UserActivationModel): Promise<BaseModel | void> {
		// Load the template for the email
		const template = await readFile(`${__dirname}/../../views/emails/activation-email-html.mst`, "utf8");
		const websiteName = process.env["WEBSITE_NAME"] || "FSSK";

		const user = await this.getUser(userActivation.get("user_id"));

		// Render our reset password template
		let output;
		try {
			output = Mustache.render(template, {
				name: user.get("name"),
				websiteName,
				activationUrl: `${process.env["SITE_URL"]}/activate-account/${userActivation.get("token")}`,
			});
		} catch (error) {
			throw new Error("Could not render e-mail template because: " + error);
		}

		// Send the email
		await sendEmail({
			subject: `Activate Account on ${websiteName}`,
			from: `"${websiteName} Support" <${process.env["SUPPORT_EMAIL"] || ""}>`,
			to: [user.get("email")],
			text: output,
			html: output,
		});
	}
}
