import {observer} from "mobx-react";
import * as React from "react";
import FormInput from "../../common/component/form-input-component";
import TodoModel, {ITodoModelProps} from "../model/todo-model";
import * as autoBind from "auto-bind";

interface ITodoItemComponentProps {
	todo: TodoModel;
	todoIndex: number;
	updateField: (todoIndex: number) => (name: string, value: string) => void;
	cancelAdd: () => void;
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
			editable: props.todo.title ? false : true,
			title: props.todo.title,
		};
		autoBind(this);
	}

	public render() {
		const isNew = this.state.title ? false : true;
		const todoitem = this.renderTodoItem();
		return (
			<li className="list-group-item list-group-flush">
				<div className="form-check">
					<label className="form-check-label">
					<input
						className="form-check-input"
						type="checkbox"
						checked={!!this.props.todo.completed}
						onChange={this.toggleCompleted}
					/>
				</label>
				</div>
				{todoitem}
				{!isNew && <button
					className="btn btn-link btn-sm"
					onClick={this.deleteTodo}
				>Delete
				</button>
				}
			</li>
		);
	}

	private renderTodoItem() {
		if (this.state.editable) {
			return (
				<div className="form-inline">
				<FormInput
						inputClass="form-control"
						type="text"
						name="title"
						placeholder="What do you need to do?"
						value={this.props.todo.title}
						onChange={this.props.updateField(this.props.todoIndex)}
						size={40}
				/>
				<button
					className="btn btn-primary btn-sm"
					onClick={this.updateTodo}
				>Save
				</button>
				<button
					className="btn btn-outline-light btn-sm"
					onClick={this.cancelUpdateTodo}
				>Cancel
				</button>
				</div>
			);
		} else {
			return (
				<div className="form-inline">
				{this.state.title} (updated {this.props.todo.timeSinceUpdated()})
				<button className="btn btn-outline-primary btn-sm" onClick={this.enableEditing}>Update</button>
				</div>
			);

		}
	}

	private toggleCompleted() {
		this.props.updateTodo(this.props.todo, {completed: !this.props.todo.completed});
	}

	private enableEditing() {
		this.setState({ editable: true });
	}

	private deleteTodo() {
		this.props.deleteTodo(this.props.todo);
	}

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

	private cancelUpdateTodo() {
		if (!this.state.title) {
			this.props.cancelAdd();
		} else {
			this.props.cancelUpdate(this.props.todoIndex, this.state.title);
			this.setState({ editable: false });
		}
	}

}
