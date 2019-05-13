import * as Knex from "knex";

exports.up = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.createTableIfNotExists("user_activations", (table) => {
		table.uuid("token").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.uuid("user_id").notNullable();
		table.foreign("user_id").references("users.id");
		table.unique(["user_id"]);
		table.timestamps(true);
	}));
};

exports.down = function(knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.dropTable("user_activations"));
};
