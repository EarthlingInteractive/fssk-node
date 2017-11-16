import Base from "../base/base";

export default class Users extends Base {
	get tableName() { return "users"; }
	get idAttribute() { return "id"; }
	get hasTimestamps() { return true; }
	get hidden() { return ["password"]; }  // don't return the password as part of toJSON() calls
}
