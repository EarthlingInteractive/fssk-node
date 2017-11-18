import * as Knex from "knex";
import * as bcrypt from "bcrypt";

exports.seed = (knex: Knex): Promise<any> => {
	// Deletes ALL existing entries
	return Promise.resolve(knex("users").del()
		.then(() => {
			return knex("users").insert([
				{id: "09881646-ee06-11e6-83ef-18dbf21dd15f",
					email: "test@earthlinginteractive.com",
					password: bcrypt.hashSync("test", 8),
					name: "Testy McTesterson",
					is_admin: false },
			]);
		}));
};
