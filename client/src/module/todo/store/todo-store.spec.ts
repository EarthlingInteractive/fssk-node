import * as fetchUtils from "../../../util/fetch-util";
const fetchMock = require("fetch-mock"); // tslint:disable-line
import TodoModel from "../model/todo-model";
import { TodoStore } from "./todo-store";


describe("TodoStore", () => {

	describe("saveAndAddTodo", () => {
		const testProps = { title: "Hello" };
		const testModel = new TodoModel(testProps);

		afterEach(() => {
			fetchMock.restore();
		});

		it("should create new todo with given props", () => {

			const getDataFromServer = spyOn(fetchUtils, "default")
				.and.returnValue(Promise.resolve(testModel.getPostProperties()));

			const store = new TodoStore();
			return store.saveAndAddTodo(testModel).then((addedTodo) => {
				expect(getDataFromServer.calls.any()).toBeTruthy();
				expect(getDataFromServer.calls.argsFor(0)).toEqual(["/api/todos", {
					body: testModel.getPostProperties(),
					method: "POST",
				}]);
				expect(addedTodo).toBeDefined();
				if (addedTodo) {
					expect(addedTodo.title).toEqual(testModel.title);
				}
			});
		});

		it("should report service errors", () => {
			fetchMock.post("*", {
				status: 418,
				statusCode: 418,
				headers: new Headers({"Content-Type":  "application/json"}),
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
