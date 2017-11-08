import * as Knex from "knex";

export = {

	development: {
		client: process.env["DBCLIENT"] || "pg",
		debug: true,
		connection: {
			charset  : "utf8",
			database : process.env["POSTGRES_DATABASE"] || "full-stack-starter-kit",
			host     : process.env["POSTGRES_HOST"] || "postgres",
			password : process.env["POSTGRES_PASSWORD"] || "qwerty1234",
			user     : process.env["POSTGRES_USER"] || "postgres",
		},
		migrations: {
			directory: "./migrations/upgrades",
			tableName: "migrations",
		},
		seeds: {
			directory: "./migrations/seeds",
		},
	} as Knex.Config,
	production: {
		client: process.env["DBCLIENT"] || "pg",
		debug: false,
		connection: {
			charset  : "utf8",
			database : process.env["POSTGRES_DATABASE"],
			host     : process.env["POSTGRES_HOST"],
			password : process.env["POSTGRES_PASSWORD"],
			user     : process.env["POSTGRES_USER"],
		},
		migrations: {
			directory: "./migrations/upgrades",
			tableName: "migrations",
		},
	} as Knex.Config,

} as any;
