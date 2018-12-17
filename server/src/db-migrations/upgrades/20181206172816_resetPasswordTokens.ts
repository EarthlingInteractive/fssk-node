import * as Knex from "knex";

exports.up = function (knex: Knex): Promise<any> {
	return Promise.resolve(knex.schema.createTableIfNotExists("passwordreset", (table) => {
		table.uuid("tokenhash").primary().defaultTo(knex.raw("uuid_generate_v4()"));
		table.uuid("user_id").notNullable();
		table.foreign("user_id").references("users.id");
		table.string("ipaddress");
		table.boolean("completed").defaultTo(false);
		table.dateTime('expires_at').notNullable();
		table.timestamps(true);
	}));
};

exports.down = function (knex: Knex): Promise<any> {
    return Promise.resolve(knex.schema.dropTable("passwordreset"));
};
