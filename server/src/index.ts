import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import entity from './routes/entity';
import { User } from './entity/User';
import { Todo } from './entity/Todo';
import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from  'body-parser';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const connectionOptions: PostgresConnectionOptions = {
	'type': 'postgres',
	'host': process.env['POSTGRES_HOST'],
	'port': process.env['POSTGRES_PORT'] as any,
	'username': process.env['POSTGRES_USER'],
	'password': process.env['POSTGRES_PASSWORD'],
	'database': process.env['POSTGRES_DATABASE'],
	'synchronize': process.env['TYPEORM_SYNCHRONIZE'] as any,
	'logging': process.env['TYPEORM_LOGGING'] as any,
	'entities': [
		__dirname + '/entity/*.ts'
	],
	'migrations': [
		'src/migration/**/*.ts'
	],
	'subscribers': [
		'src/subscriber/**/*.ts'
	],
	'cli': {
		'entitiesDir': 'src/entity',
		'migrationsDir': 'src/migration',
		'subscribersDir': 'src/subscriber'
	}
};

createConnection(connectionOptions).then(async connection => {

	const app = express();
	app.use(bodyParser.json());

	const router = express.Router();

// =============================================== API ==================================================

	router.use('/api/users', entity(User));
	router.use('/api/todos', entity(Todo));

// =========================================== DEFAULT ROUTE ============================================
	router.get('/', async function (req: Request, res: Response) {
		res.send('Hello World!');
	});
	app.use(router);


	app.listen(4000);

}).catch(error => console.error(error));
