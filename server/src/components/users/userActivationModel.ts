import BaseModel from "../base/baseModel";
import UserModel from "../users/userModel";

export default class UserActivationModel extends BaseModel {
	get tableName() { return "user_activations"; }
	get idAttribute() { return "token"; }
	get hasTimestamps() { return true; }
	get user() {
		return this.belongsTo(UserModel, 'user_id');
	}
}
