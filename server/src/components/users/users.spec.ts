import Base from "../base/base";
import Users from "./users";

test("is a subclass of Base", () => {
	const users = new Users();
	expect(users instanceof Base).toBeTruthy();
});

test("has the correct tableName", () => {
	const users = new Users();
	expect(users.tableName).toEqual("users");
});

test("defines the idAttribute", () => {
	const users = new Users();
	expect(users.idAttribute).toEqual("id");
});

test("has timestamps", () => {
	const users = new Users();
	expect(users.hasTimestamps).toBeTruthy();
});
