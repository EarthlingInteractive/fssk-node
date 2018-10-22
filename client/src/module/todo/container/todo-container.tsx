import {observer} from "mobx-react";
import * as React from "react";
import NavComponent from "../../common/component/nav-component";
import TodoItemComponent from "../component/todo-item-component";
import TodoModel, {ITodoModelProps} from "../model/todo-model";
import TodoStore from "../store/todo-store";


@observer
export default class TodoContainer extends React.Component<any> {

	public componentDidMount() {
		TodoStore.loadTodos();
	}

	public render() {

		const eventHandlers = {
			updateField: TodoStore.updateField,
			cancelAdd: TodoStore.cancelAdd,
			cancelUpdate: TodoStore.cancelUpdate,
			saveTodo: this.saveTodo,
			updateTodo: this.updateTodo,
			deleteTodo: this.deleteTodo,
		};

		const cardStyle = {
				width: "50rem",
				marginTop: "80px",
				marginRight: "auto",
				marginLeft: "auto",
				zIndex: 1040,
		};

		return (
			<div className="container">
				<NavComponent history={this.props.history} />
					<div className="card" style={cardStyle}>
						<h2 className="card-header">To-Do List</h2>
						<ul className="list-group list-group-flush">
							{TodoStore.todos.map((todo: TodoModel, i: number) => {
								const itemComponentKey = todo && todo.id ? `id-${todo.id}` : `new-${i}`;
								return (
									<TodoItemComponent
										key={`ItemComponent-${itemComponentKey}`}
										todo={todo}
										todoIndex={i}
										{...eventHandlers}
									/>
								);
							})}
							<li className="list-group-item"><button className="btn btn-success" onClick={this.addTodo}>+</button></li>
						</ul>
					</div>
			</div>
		);
	}

	private addTodo() {
		TodoStore.addTodo(new TodoModel({
				title: "",
		}));
	}

	private saveTodo(todo: TodoModel) {
		TodoStore.saveTodo(todo);
	}

	private updateTodo(todo: TodoModel, newProps: ITodoModelProps) {
		TodoStore.saveAndUpdateTodo(todo, newProps);
	}

	private deleteTodo(todo: TodoModel) {
		// Here's an example of why we don't just pass the store object down to the
		// component. We may reuse the todo component in another place and not want
		// a speedbump to confirm deletion.  This way we can include any usage specific
		// behavior here, before accessing the store.
		if (confirm("Delete this item?")) {
			TodoStore.saveAndDeleteTodo(todo);
		}
	}
}
