
import TodoModel, {ITodoModelProps} from "./todo-model";

describe("TodoModel", () => {
	it("can be created", () => {
		const testProps: ITodoModelProps = {
			id: "1",
			title: "Hello",
			order: 3,
			completed: false,
			createdAt: "2017-01-01",
			updatedAt: "2017-01-01",
		};
		const testModel = new TodoModel(testProps);
		expect(testModel).not.toBeNull();
	});
});
