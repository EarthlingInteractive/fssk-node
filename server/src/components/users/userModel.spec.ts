import BaseModel from "../base/baseModel";
import UserModel from "./userModel";

test("is a subclass of Base", () => {
	const users = new UserModel();
	expect(users instanceof BaseModel).toBeTruthy();
});

test("has the correct tableName", () => {
	const users = new UserModel();
	expect(users.tableName).toEqual("users");
});

test("defines the idAttribute", () => {
	const users = new UserModel();
	expect(users.idAttribute).toEqual("id");
});

test("has timestamps", () => {
	const users = new UserModel();
	expect(users.hasTimestamps).toBeTruthy();
});
