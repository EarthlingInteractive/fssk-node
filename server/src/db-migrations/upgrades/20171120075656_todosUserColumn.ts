import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.table("todos", (table) => {
		table.uuid("user_id");
		table.foreign("user_id").references("users.id");
	}));
};

exports.down = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.table("todos", (table) => {
		table.dropColumn("user_id");
	}));
};
