import * as bcrypt from "bcrypt";
import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import Users from "./users";
import Base from "../base/base";
import {Collection, Model} from "bookshelf";

export default class UsersController {

	public async getUsers(): Promise<void | Collection<Model<Users>>> {
		const usersCollection = await Users
			.fetchAll()
			.catch(handleDatabaseErrors);
		return usersCollection;
	}

	public async getUser(id: string): Promise<Base | void> {
		if (!Validator.isUUID(id, "4")) {
			throw new Error("Invalid ID");
		}
		const user = await new Users()
			.where({id})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
	}

	public async getUserByEmail(email: string): Promise<any> {
		if (!Validator.isEmail(email)) {
			throw new Error("Invalid Email");
		}
		const user = await new Users()
			.where({email})
			.fetch()
			.catch(handleDatabaseErrors);
		return user;
	}

	public async createUser(data: any): Promise<any> {
		// const requiredFields = ["password", "name", "email"];
		// const missingRequired = validation.checkRequiredFields(requiredFields, data);
		// if (missingRequired.length > 0) {
			// throw new ValidationError(ValidationError.types.MISSING_REQUIRED_FIELDS, missingRequired.toString());
		// }

		if (!Validator.isEmail(data.email)) {
			throw new Error("email");
		}

		// make sure the email address isn't already used
		const existingUser = await new Users()
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

		const user = await new Users(data)
			.save()
			.catch(handleDatabaseErrors);

		return user;
	}
}
