import BaseModel from "../base/baseModel";
import TodoModel from "./todoModel";

test("is a subclass of Base", () => {
	const model = new TodoModel();
	expect(model instanceof BaseModel).toBeTruthy();
});

test("has the correct tableName", () => {
	const model = new TodoModel();
	expect(model.tableName).toEqual("todos");
});

test("defines the idAttribute", () => {
	const model = new TodoModel();
	expect(model.idAttribute).toEqual("id");
});

test("has timestamps", () => {
	const model = new TodoModel();
	expect(model.hasTimestamps).toBeTruthy();
});
