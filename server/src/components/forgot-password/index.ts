import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import UsersController from "../users/index";
import PasswordResetModel from "../reset-password/passwordResetModel"
import sendEmail from "../../util/sendEmail";
import * as Mustache from "mustache";
import * as fs from 'fs';
import {promisify} from 'util';
import * as moment from 'moment';

// Convert the filesystem stuff to be promises
const readFile = promisify(fs.readFile);

const usersController = new UsersController();

export default class ForgotPasswordController {
	public async createForgotPasswordToken(data : any, ipaddress) : Promise<any> {
		// Find the user via their email (UsersController already does this)
		const existingUser = await usersController.getUserByEmail(data.email);
		if (!existingUser) {
			throw new Error("User does not exist");
		}

		const tokenExpireDate = moment().add(process.env["FORGOT_PASSWORD_EXPIRE_DAYS"], 'days').format('YYYY-MM-DD');

		// Create our passwordreset model
		const passwordResetModel = await this.createPasswordReset({
			user_id: existingUser.id,
			completed: false,
			ipaddress,
			expires_at: tokenExpireDate,
		});

		// Load the forgot password template for the email
		let template = await readFile(`${__dirname}/../../views/emails/reset-password-email-html.mst`, "utf8");
		let websiteName = process.env["WEBSITE_NAME"] || "FSSK";

		// Render our reset password template
		let output;
		try {
			output = Mustache.render(template, {
				name: existingUser.get('name'),
				websiteName,
				resetUrl: `${process.env["SITE_URL"]}/reset-password/${passwordResetModel.get('tokenhash')}`,
			});
		} catch(error) {
			throw new Error("Could not render e-mail template because: " + error);
		}

		// Send the email
		await sendEmail({
			subject: `Forgot Password on ${websiteName}`,
			from: `"${websiteName} Support" <${process.env["SUPPORT_EMAIL"] || ''}>`,
			to: [existingUser.get('email')],
			text: output, // We should probably strip the html out of this 
			html: output,
		});

		return {
			user: existingUser
		};
	}

	public async createPasswordReset(data: any): Promise<any> {
		const pwordReset = await new PasswordResetModel(data)
			.save()
			.catch(handleDatabaseErrors);
		return pwordReset;
	}
}
