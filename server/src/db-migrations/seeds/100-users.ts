import * as Knex from "knex";
import * as bcrypt from "bcrypt";

exports.seed = (knex: Knex): Promise<any> => {
	// Deletes ALL existing entries
	return Promise.resolve(knex("users").del()
		.then(() => {
			return knex("users").insert([
				{id: "52bd60d3-fde7-4625-bc1f-2ea2e2288072",
					email: "test@earthlinginteractive.com",
					password: bcrypt.hashSync("test", 8),
					name: "Testy McTesterson",
					is_admin: false },
			]);
		}));
};
