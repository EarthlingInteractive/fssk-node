import {action, configure, IObservableArray, observable, runInAction} from "mobx";
import fetchUtil from "../../../util/fetch-util";
import TodoModel, {ITodoModelProps} from "../model/todo-model";
import authStore from "../../authentication/store/auth-store";

configure({
	enforceActions: true, // don't allow editing of state outside of mobx actions
});

export class TodoStore {
	@observable public todos: IObservableArray<TodoModel> = observable.array([]);

	@action.bound public updateField(todoIndex: number) {
		return action((field: string, val: string) => {
			if (field === "title") {
				this.todos[todoIndex].title = val;
			} else {
				this.handleError(new Error(`Something tried to update a field named ${field} in the todo store`));
				return;
			}
		});
	}

	@action.bound public cancelUpdate(index: number, val: string) {
		this.todos[index].title = val;
	}

	@action.bound public cancelAdd(todo: TodoModel) {
		this.deleteTodo(todo);
	}

	@action public addTodo(todo: TodoModel): TodoModel {
		const user = authStore.user;
		if (user) {
			todo.user_id = user.id;
		}
		this.todos.push(todo);
		return todo;
	}

	@action public async loadTodos(): Promise<void> {
		try {
			const user = authStore.user;
			const todosData: any = await fetchUtil("/api/users/" + user.id + "/todos");

			runInAction(() => {
				this.todos.clear();
				todosData.forEach((todoData: ITodoModelProps) => {
					this.addTodo(new TodoModel(todoData));
				});
			});
		} catch (error) {
			this.handleError(error);
		}
	}

	@action public async saveTodo(todo: TodoModel): Promise<TodoModel | undefined> {
		try {
			const todoData: any = await fetchUtil("/api/todos", {
				body: todo.getPostProperties(),
				method: "POST",
			});
			todo.setProperties(todoData);
		} catch (error) {
			this.handleError(error);
		}
		return todo;
	}

	@action public async saveAndAddTodo(todo: TodoModel): Promise<TodoModel | undefined> {
		let addedTodo: TodoModel | undefined;
		try {
			const todoData: any = await fetchUtil("/api/todos", {
				body: todo.getPostProperties(),
				method: "POST",
			});
			this.cancelAdd(todo);
			addedTodo = this.addTodo(new TodoModel(todoData));
		} catch (error) {
			this.handleError(error);
		}
		return addedTodo;
	}

	@action public async saveAndDeleteTodo(todo: TodoModel): Promise<void> {
		try {
			await fetchUtil("/api/todos/" + todo.id, {
				method: "DELETE",
			});
			this.deleteTodo(todo);
		} catch (error) {
			this.handleError(error);
		}
	}

	@action public async saveAndUpdateTodo(todo: TodoModel, newProps: ITodoModelProps): Promise<TodoModel> {
		try {
			const todoData: any = await fetchUtil("/api/todos/" + todo.id, {
				body: newProps,
				method: "PUT",
			});
			runInAction(() => {
				todo.setProperties(todoData);
			});
		} catch (error) {
			this.handleError(error);
		}
		return todo;
	}

	@action private deleteTodo(todo: TodoModel): void {
		let idx: number;
		for (idx = 0; idx < this.todos.length; idx += 1) {
			if (this.todos[idx].id === todo.id) {
				this.todos.splice(idx, 1);
				break;
			}
		}
	}

	private handleError(error: Error) {
		// @todo report this error, somehow...?
		console.error(error);
	}
}

const todoStore = new TodoStore();
export default todoStore;
