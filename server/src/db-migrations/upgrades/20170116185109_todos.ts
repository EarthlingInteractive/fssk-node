import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
	return Promise.resolve(knex.schema.createTableIfNotExists("todos", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.string("title");
		table.integer("order");
		table.boolean("completed");
		table.timestamps(false, true);
	}));
};

exports.down = (knex: Knex): Promise<any> => {
	return Promise.resolve(knex.schema.dropTable("todos"));
};
