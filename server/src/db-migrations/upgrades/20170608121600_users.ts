import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
	return Promise.resolve(knex.schema.createTableIfNotExists("users", (table) => {
		table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.string("email");
		table.unique(["email"]);
		table.string("name");
		table.text("password");
		table.boolean("is_admin");
		table.timestamps(false, true);
	}));
};

exports.down = (knex: Knex): Promise<any> => {
	return Promise.resolve(knex.schema.dropTable("users"));
};
