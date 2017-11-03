require('dotenv');
import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";

createConnection({
	"type": "postgres",
	"host": "localhost",
	"port": 5432,
	"username": "root",
	"password": "admin",
	"database": "test",
	"synchronize": true,
	"logging": true,
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
}).then(async connection => {
	console.log(connection.options);
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
