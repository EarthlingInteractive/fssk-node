import { getConnection, getRepository, Repository, FindManyOptions } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import { validate } from 'class-validator';

export default function entity(entityClass: any): express.Router {
	const router = express.Router();
	const repository = getConnection().getRepository(entityClass);

	router.get('/', async function(req: Request, res: Response) {
		let findOptions: any = {};
		if (req.query.relations) {
			findOptions.relations = req.query.relations.split(',');
		}
		res.send(await repository.find({}));
	});

	router.get('/:id', async function(req: Request, res: Response) {
		res.send(await repository.findOne(req.params.id));
	});

	router.post('/', async function(req: Request, res: Response) {
		const postEntity = repository.create(req.body);
		const errors = await validate(postEntity);
		if (errors.length > 0) {
			throw new Error(`Validation failed!`);
		}
		res.send(await repository.save(postEntity));
	});

	router.put('/:id', async function(req: Request, res: Response) {
		const putEntity = repository.create(req.body);
		const errors = await validate(putEntity);
		if (errors.length > 0) {
			throw new Error(`Validation failed!`);
		}
		res.send(await repository.updateById(req.params.id, putEntity));
	});

	router.delete('/:id', async function(req: Request, res: Response) {
		res.send(await repository.removeById(req.params.id));
	});

	return router;
}
