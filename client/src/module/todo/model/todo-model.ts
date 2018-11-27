import {action, observable, runInAction} from "mobx";
import Moment from "moment";

export interface ITodoModelProps {
	id?: string;
	title?: string;
	order?: number;
	completed?: boolean;
	created_at?: string;
	updated_at?: string;
	user_id?: string;
}

export default class TodoModel {
	@observable public id: string | undefined;
	@observable public title: string;
	@observable public order: number = 0;
	@observable public completed: boolean = false;
	@observable public user_id: string | undefined; // tslint:disable-line
	@observable public createdAt: string;
	@observable public updatedAt: string;

	constructor(props: ITodoModelProps) {
		this.setProperties(props);
	}

	public getPostProperties(): ITodoModelProps {
		return {
			completed: this.completed,
			id: this.id,
			order: this.order,
			title: this.title,
			user_id: this.user_id,
		};
	}

	@action public updateField(field: string, val: string) {
		switch (field) {
			case "title":
				this.title = val;
				break;
			default:
				console.log("error updating todo field");
				return;
		}
	}

	@action public setProperties(props: ITodoModelProps) {
		runInAction(() => {
			if (props.id) { this.id = props.id; }
			if (props.title) { this.title = props.title; }
			if (props.order) { this.order = props.order; }
			if (props.completed !== undefined) { this.completed = props.completed; }
			if (props.user_id !== undefined) { this.user_id = props.user_id; }
			if (props.created_at) { this.createdAt = props.created_at; }
			if (props.updated_at) { this.updatedAt = props.updated_at; }
		});
	}

	public timeSinceUpdated() {
		return Moment(this.updatedAt).fromNow();
	}

}
