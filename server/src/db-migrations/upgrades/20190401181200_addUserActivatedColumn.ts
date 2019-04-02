import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.table("users", (table) => {
		table.boolean("activated").defaultTo(false);
	}));
};

exports.down = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.table("users", (table) => {
		table.dropColumn("activated");
	}));
};
