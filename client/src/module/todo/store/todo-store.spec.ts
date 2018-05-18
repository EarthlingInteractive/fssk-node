const fetchMock = require("fetch-mock"); // tslint:disable-line
import TodoModel from "../model/todo-model";
import { TodoStore } from "./todo-store";


describe("TodoStore", () => {

	describe("saveAndAddTodo", () => {
		const testProps = { id: "1", title: "Hello" };
		const testModel = new TodoModel(testProps);

		afterEach(() => {
			fetchMock.restore();
		});

		it("should create new todo with given props", () => {

			fetchMock.post("*", {
				status: 201,
				headers: {"Content-Type":  "application/json"},
				body: testProps,
			});

			const store = new TodoStore();
			return store.saveAndAddTodo(testModel).then((addedTodo) => {
				expect(addedTodo).toBeDefined();
				if (addedTodo) {
					expect(addedTodo.title).toEqual(testModel.title);
				}
			});
		});

		it("should report service errors", () => {
			fetchMock.post("*", {
				status: 418,
				headers: {"Content-Type":  "application/json"},
				body: {code: 418, message: "I'm a little teapot"},
			});
			const consoleErrorSpy = spyOn(console, "error");
			const store = new TodoStore();
			return store.saveAndAddTodo(testModel).then((addedTodo) => {
				expect(addedTodo).toBeUndefined();
				expect(consoleErrorSpy).toHaveBeenCalled();
			});

		});
	});

});
