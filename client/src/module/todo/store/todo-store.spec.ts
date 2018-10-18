const fetchMock = require("fetch-mock"); // tslint:disable-line
import TodoModel from "../model/todo-model";
import { TodoStore } from "./todo-store";


describe("TodoStore", () => {

	describe("saveTodo", () => {
		const testProps = { id: undefined, title: "Howdy" };
		const testModel = new TodoModel(testProps);

		afterEach(() => {
			fetchMock.restore();
		});

		it ("should save todo with given props", () => {
			// Mock our save to return a saved model with a new id
			const responsePostBody = {id: "1", title: "So Long"}
			fetchMock.post("*", {
				status: 201,
				headers: {"Content-Type":  "application/json"},
				body: responsePostBody,
			});

			// Create new store and add our model to it
			const store = new TodoStore();
			store.addTodo(testModel);

			// Save the todo
			return store.saveTodo(testModel).then((savedTodo) => {
				// We should get a todo that was saved
				expect(savedTodo).toBeDefined();
				if(savedTodo) {
					// Expect the todo we saved to be equal the one we posted
					expect(savedTodo.id).toEqual(responsePostBody.id);
					expect(savedTodo.title).toEqual(responsePostBody.title);

					// The test model should be updated with what was returned from saving
					expect(testModel.title).toEqual(savedTodo.title);
					expect(testModel.id).toEqual(savedTodo.id);

					// Should have one todo in store
					expect(store.todos.length).toEqual(1);
				}
			});
		});
	})

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

				// Should have one todo in store
				expect(store.todos.length).toEqual(1);
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
