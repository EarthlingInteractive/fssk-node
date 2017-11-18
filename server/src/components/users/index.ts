import * as bcrypt from "bcrypt";
import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import UserModel from "./userModel";
import BaseModel from "../base/baseModel";
import {Collection, Model} from "bookshelf";

export default class UsersController {

	public async getUsers(): Promise<void | Collection<Model<UserModel>>> {
		const usersCollection = await UserModel
			.fetchAll()
			.catch(handleDatabaseErrors);
		return usersCollection;
	}

	public async getUser(id: string): Promise<BaseModel | void> {
		if (!Validator.isUUID(id, "4")) {
			throw new Error("Invalid ID");
		}
		const user = await new UserModel()
			.where({id})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
	}

	public async getUserByEmail(email: string): Promise<BaseModel | void> {
		if (!Validator.isEmail(email)) {
			throw new Error("Invalid Email");
		}
		const user = await new UserModel()
			.where({email})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
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

		return user;
	}
}
