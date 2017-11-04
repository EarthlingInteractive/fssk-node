require("dotenv").config();

module.exports =  {
	"type": "postgres",
	"host": process.env["POSTGRES_HOST"],
	"port": process.env["POSTGRES_PORT"],
	"username": process.env["POSTGRES_USER"],
	"password": process.env["POSTGRES_PASSWORD"],
	"database": process.env["POSTGRES_DATABASE"],
	"synchronize": process.env["TYPEORM_SYNCHRONIZE"],
	"logging": process.env["TYPEORM_LOGGING"],
	"entities": [
		"src/entity/*.ts"
	],
	"migrations": [
		"src/migration/**/*.ts"
	],
	"subscribers": [
		"src/subscriber/**/*.ts"
	],
	"cli": {
		"entitiesDir": "src/entity",
		"migrationsDir": "src/migration",
		"subscribersDir": "src/subscriber"
	}
};
