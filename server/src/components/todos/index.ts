import * as bcrypt from "bcrypt";
import * as Validator from "validator";
import handleDatabaseErrors from "../../util/handleDatabaseErrors";
import BaseModel from "../base/baseModel";
import {Collection, Model} from "bookshelf";
import TodoModel from "./todoModel";

export default class TodosController {

	public async getTodos(): Promise<void | Collection<Model<TodoModel>>> {
		const collection = await TodoModel
			.fetchAll()
			.catch(handleDatabaseErrors);
		return collection;
	}

	public async getTodo(id: string): Promise<BaseModel | void> {
		if (!Validator.isUUID(id, "4")) {
			throw new Error("Invalid ID");
		}
		const todo = await new TodoModel()
			.where({id})
			.fetch()
			.catch(handleDatabaseErrors);
		return todo;
	}

	public async getTodosByUser(userId: string): Promise<Collection<Model<BaseModel>> | void> {
		if (!Validator.isUUID(userId, "4")) {
			throw new Error("Invalid ID");
		}
		const collection = await new TodoModel()
			.orderBy("order")
			.orderBy("created_at")
			.where({user_id: userId})
			.fetchAll()
			.catch(handleDatabaseErrors);
		return collection;
	}

	public async createTodo(data: any): Promise<any> {
		const todo = await new TodoModel(data)
			.save()
			.catch(handleDatabaseErrors);
		return todo;
	}

	public async updateTodo(data: any): Promise<any> {
		const todo = await new TodoModel(data).save();
		return todo;
	}

	public async deleteTodo(id: string): Promise<any> {
		const todo = await new TodoModel({id})
			.destroy()
			.catch(handleDatabaseErrors);
		return todo;
	}
}
