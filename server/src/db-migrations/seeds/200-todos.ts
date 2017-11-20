import * as Knex from "knex";

exports.seed = (knex: Knex): Promise<any> => {
	// Deletes ALL existing entries
	return Promise.resolve(knex("todos").del()
		.then(() => {
			return knex("todos").insert([
				{title: "test 1", order: 1, completed : false, user_id: "52bd60d3-fde7-4625-bc1f-2ea2e2288072"},
				{title: "test 2", order: 2, completed : true, user_id: "52bd60d3-fde7-4625-bc1f-2ea2e2288072"},
				{title: "test 3", order: 3, completed : false, user_id: "52bd60d3-fde7-4625-bc1f-2ea2e2288072"},
			]);
		}));
};
