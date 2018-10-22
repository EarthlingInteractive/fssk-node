import {observer} from "mobx-react";
import * as React from "react";
import FormInput from "../../common/component/form-input-component";
import TodoModel, {ITodoModelProps} from "../model/todo-model";
import autobind from "autobind-decorator";

interface ITodoItemComponentProps {
	todo: TodoModel;
	todoIndex: number;
	updateField: (todoIndex: number) => (name: string, value: string) => void;
	cancelAdd: (todo: TodoModel) => void;
	cancelUpdate: (todoIndex: number, val: string) => void;
	saveTodo: (todo: TodoModel) => void;
	updateTodo: (todo: TodoModel, newProps: ITodoModelProps) => void;
	deleteTodo: (todo: TodoModel) => void;
}

interface ITodoItemComponentState {
	editable: boolean;
	title: string;
}

@observer
export default class TodoItemComponent extends React.Component<ITodoItemComponentProps, ITodoItemComponentState> {

	constructor(props: any) {
		super(props);
		this.state = {
			editable: !props.todo.title,
			title: props.todo.title,
		};
	}

	public render() {
		const todoElement = this.state.editable ? this.renderTodoForm() : this.renderTodoItem();
		return (
			<li className="list-group-item list-group-flush">
				{todoElement}
			</li>
		);
	}

	@autobind
	private submitTodoForm(event: any) {
		event.preventDefault();
		this.updateTodo();
	}

	private renderTodoForm() {
		return (
			<form className="form-row" onSubmit={this.submitTodoForm}>
				<div className="col-10">
					<FormInput
						inputClass="form-control"
						type="text"
						name="title"
						autoFocus
						placeholder="What do you need to do?"
						value={this.props.todo.title}
						onChange={this.props.updateField(this.props.todoIndex)}
					/>
				</div>
				<div className="col-1">
					<button
						className="btn btn-primary btn-sm"
						type="submit"
					>Save
					</button>
				</div>
				<div className="col-1">
					<button
						className="btn btn-outline-secondary btn-sm"
						onClick={this.cancelUpdateTodo}
					>Cancel
					</button>
				</div>
			</form>
		);
	}

	private renderTodoItem() {
		return (
			<div className="form-row">
				<div className="col-10">
					<div className="form-check">
						<input
							className="form-check-input"
							type="checkbox"
							id={this.props.todo.id}
							checked={!!this.props.todo.completed}
							onChange={this.toggleCompleted}
						/>
						<label className="form-check-label"  htmlFor={this.props.todo.id}>
							{!this.state.editable && <span>{this.state.title} <em>(updated {this.props.todo.timeSinceUpdated()})</em></span>}
						</label>
					</div>
				</div>
				<div className="col-1">
					<button
						className="btn btn-outline-primary btn-sm"
						onClick={this.enableEditing}
					>Update
					</button>
				</div>
				<div className="col-1">
					<button
						className="btn btn-link btn-sm"
						onClick={this.deleteTodo}
					>Delete
					</button>
				</div>
			</div>
		);
	}

	@autobind
	private toggleCompleted() {
		this.props.updateTodo(this.props.todo, {completed: !this.props.todo.completed});
	}

	@autobind
	private enableEditing() {
		this.setState({ editable: true });
	}

	@autobind
	private deleteTodo() {
		this.props.deleteTodo(this.props.todo);
	}

	@autobind
	private updateTodo() {
		if (!this.state.title) {
			this.props.saveTodo(this.props.todo);
		} else {
			this.props.updateTodo(this.props.todo, {title: this.props.todo.title});
		}
		this.setState({
			editable: false,
			title: this.props.todo.title,
		});
	}

	@autobind
	private cancelUpdateTodo() {
		if (!this.state.title) {
			this.props.cancelAdd(this.props.todo);
		} else {
			this.props.cancelUpdate(this.props.todoIndex, this.state.title);
			this.setState({ editable: false });
		}
	}

}
