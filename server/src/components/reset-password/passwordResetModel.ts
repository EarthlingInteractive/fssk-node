import BaseModel from "../base/baseModel";
import UserModel from "../users/userModel";

export default class PasswordResetModel extends BaseModel {
	get tableName() { return "passwordreset"; }
	get idAttribute() { return "token"; }
	get hasTimestamps() { return true; }
	user() {
		return this.hasOne(UserModel);
	}
}
