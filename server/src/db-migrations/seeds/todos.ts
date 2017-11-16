import * as Knex from "knex";

exports.seed = (knex: Knex): Promise<any> => {
	// Deletes ALL existing entries
	return Promise.resolve(knex("todos").del()
		.then(() => {
			return knex("todos").insert([
				{title: "test 1", order: 1, completed : false},
				{title: "test 2", order: 2, completed : true},
				{title: "test 3", order: 3, completed : false},
			]);
		}));
};
