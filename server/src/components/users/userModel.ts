import BaseModel from "../base/baseModel";

export default class UserModel extends BaseModel {
	get tableName() { return "users"; }
	get idAttribute() { return "id"; }
	get hasTimestamps() { return true; }
	get hidden() { return ["password"]; }  // don't return the password as part of toJSON() calls
}
