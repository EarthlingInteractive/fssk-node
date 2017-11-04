import "reflect-metadata";
import {createConnection, ConnectionOptions} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const connectionOptions : PostgresConnectionOptions = {
	"type": "postgres",
	"host": process.env["POSTGRES_HOST"],
	"port": process.env["POSTGRES_PORT"] as any,
	"username": process.env["POSTGRES_USER"],
	"password": process.env["POSTGRES_PASSWORD"],
	"database": process.env["POSTGRES_DATABASE"],
	"synchronize": process.env["TYPEORM_SYNCHRONIZE"] as any,
	"logging": process.env["TYPEORM_LOGGING"] as any,
	"entities": [
		__dirname + "/entity/*.ts"
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

createConnection(connectionOptions).then(async connection => {
	const user = new User();
	const userRepository = connection.getRepository(User);

	const app = express();
	app.use(bodyParser.json());

	app.get('/', async function (req: Request, res: Response) {
		res.send('Hello World!');
	});

	app.get("/users", async function(req: Request, res: Response) {
		res.send(await userRepository.find());
	});

	app.post("/users", async function(req: Request, res: Response) {
		const user = userRepository.create(req.body);
		res.send(await userRepository.save(user));
	});

	app.listen(4000);

}).catch(error => console.log(error));
