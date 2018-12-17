import BaseModel from "../base/baseModel";
import PasswordResetModel from "./passwordResetModel";

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
	expect(model.idAttribute).toEqual("tokenhash");
});

test("has timestamps", () => {
	const model = new PasswordResetModel();
	expect(model.hasTimestamps).toBeTruthy();
});
