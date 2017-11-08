import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import knexfile = require("./knexfile");

export class Database {

	protected _knex: Knex;

	protected _bookshelf: Bookshelf;

	constructor(config: Knex.Config) {
		if (!config) {
			throw new Error("No config object given to Database class.");
		}
		this._knex = Knex(config);
		this._bookshelf = Bookshelf(this._knex);
		this._bookshelf.plugin("visibility");  // allow whitelisting/blacklisting attributes when returning toJSON()
	}

	public get knex(): Knex {
		return this._knex;
	}

	public get bookshelf(): Bookshelf {
		return this._bookshelf;
	}
}

export default new Database(knexfile[process.env["NODE_ENV"] || "development"]);
