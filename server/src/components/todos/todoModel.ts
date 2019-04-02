import BaseModel from "../base/baseModel";
import UserModel from "../users/userModel";

export default class TodoModel extends BaseModel {
	get tableName() { return "todos"; }
	get idAttribute() { return "id"; }
	get hasTimestamps() { return true; }
	user() {
		return this.hasOne(UserModel);
	}
}
