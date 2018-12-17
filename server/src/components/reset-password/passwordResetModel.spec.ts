import BaseModel from "../base/baseModel";
import TodoModel from "./todoModel";

test("is a subclass of Base", () => {
	const model = new PasswordResetModel();
	expect(model instanceof BaseModel).toBeTruthy();
});

test("has the correct tableName", () => {
	const model = new PasswordResetModel();
	expect(model.tableName).toEqual("passwordreset");
});

test("defines the idAttribute", () => {
	const model = new PasswordResetModel();
	expect(model.idAttribute).toEqual("id");
});

test("has timestamps", () => {
	const model = new PasswordResetModel();
	expect(model.hasTimestamps).toBeTruthy();
});
