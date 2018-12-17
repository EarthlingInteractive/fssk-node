import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import UsersController from "../users/index";
import PasswordResetModel from "../reset-password/passwordResetModel";
import * as bcrypt from "bcrypt";
import * as moment from "moment";

const usersController = new UsersController();

export default class ResetPasswordController {
	public async validateResetToken(tokenhash: string): Promise<any> {
		if (!Validator.isUUID(tokenhash, "4")) {
			throw new Error("Invalid Token ID");
		}

		const resetModel = await new PasswordResetModel()
			.where({tokenhash})
			.fetch()
			.catch(handleDatabaseErrors);

		if (resetModel) {
			// Token is invalid if it was already used to reset a password
			if (resetModel.get("completed")) {
				throw new Error("Reset token was already used");
			}

			// Get the user the token is referring to
			const user = await usersController.getUser(resetModel.get("user_id"));

			// Token is invalid if the user doesn't exist - or might have some other status in the future
			// that we could check here
			if (!user) {
				throw new Error("Could not find user associated with reset token: " + tokenhash);
			}

			// Token is invalid if the token is expired
			const isExpired = moment().isAfter(resetModel.get("expires_at"));
			if (isExpired) {
				throw new Error("Reset token has expired");
			}

			// Everything checked out, so return true, the token data and the user
			return {
				isValid: true,
				token: resetModel,
				user,
			};
		}

		return {
			isValid: false,
		};
	}

	public async resetPassword(body: any): Promise<any> {
		const { email, password, resetToken } = body;

		// Check to see if the user exists based on the email
		const user = await usersController.getUserByEmail(email);
		if (!user) {
			throw new Error("User does not exist");
		}

		// Get and check for valid reset token
		const resetModel = await new PasswordResetModel()
			.where({tokenhash: resetToken, user_id: user.id})
			.fetch()
			.catch(handleDatabaseErrors);
		if (!resetModel) {
			throw new Error("Reset token is invalid");
		}

		// Rehash new password and assign to user model
		const newPassword = await bcrypt.hash(password, 10);
		user.set("password", newPassword);

		// Save user and handle any database errors
		await user.save().catch(handleDatabaseErrors);

		// Let's also update the token as being used/consumed
		resetModel.set("completed", true);
		await resetModel.save().catch(handleDatabaseErrors);

		// Return the user we saved
		return { user };
	}
}
