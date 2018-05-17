import * as Knex from "knex";

export = {

	development: {
		client: process.env["DBCLIENT"] || "pg",
		debug: true,
		connection: {
			charset  : "utf8",
			database : process.env["POSTGRES_DATABASE"] || "test",
			host     : process.env["POSTGRES_HOST"] || "db",
			password : process.env["POSTGRES_PASSWORD"] || "admin",
			user     : process.env["POSTGRES_USER"] || "root",
		},
		migrations: {
			directory: "./db-migrations/upgrades",
			tableName: "migrations",
		},
		seeds: {
			directory: "./db-migrations/seeds",
		},
	} as Knex.Config,
	test: {
		client: process.env["DBCLIENT"] || "pg",
		debug: true,
		connection: {
			charset  : "utf8",
			database : process.env["POSTGRES_DATABASE"] || "test",
			host     : process.env["POSTGRES_HOST"] || "localhost",
			password : process.env["POSTGRES_PASSWORD"] || "admin",
			user     : process.env["POSTGRES_USER"] || "root",
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
			directory: "./db-migrations/upgrades",
			tableName: "migrations",
		},
	} as Knex.Config,

} as any;
