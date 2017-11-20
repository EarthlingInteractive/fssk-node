import * as express from "express";
import {adminAuthMiddleware, authMiddleware} from "../auth";
import TodosController from "./index";
import * as Validator from "validator";

const router = express.Router();
const todosController = new TodosController();

// only admin users may access this route
router.get("/", adminAuthMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return todosController.getTodos()
		.then((todos) => res.json(todos ? todos.toJSON() : []))
		.catch((err: Error) => next(err));
});

router.get("/:id", authMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!Validator.isUUID(req.params.id, "4")) {
		throw new Error("Invalid ID");
	}

	todosController.getTodo(req.params.id)
		.then((todo) => {
			if (todo && (req.user.get("id") !== todo.get("user_id")) && !req.user.get("is_admin")) {
				return next(new Error("Authentication Error"));
			}
			res.json(todo ? todo.toJSON() : {});
		})
		.catch((err: Error) => next(err));
});

router.post("/", authMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!Object.keys(req.body).length) {
		throw new Error("Missing Body");
	}
	return todosController.createTodo(req.body)
		.then((todo) => res.json(todo ? todo.toJSON() : {}))
		.catch((err: Error) => next(err));
});

router.put("/:id", authMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!Object.keys(req.body).length) {
		throw new Error("Missing Body");
	}
	if (!Validator.isUUID(req.params.id, "4")) {
		throw new Error("Invalid ID");
	}

	todosController.updateTodo(req.body)
		.then((todo) => {
			if (todo && (req.user.get("id") !== todo.get("user_id")) && !req.user.get("is_admin")) {
				return next(new Error("Authentication Error"));
			}
			res.json(todo ? todo.toJSON() : {});
		})
		.catch((err: Error) => next(err));
});

router.delete("/:id", authMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!Validator.isUUID(req.params.id, "4")) {
		throw new Error("Invalid ID");
	}

	return todosController.deleteTodo(req.params.id)
		.then((todo) => {
			if (todo && (req.user.get("id") !== todo.get("user_id")) && !req.user.get("is_admin")) {
				return next(new Error("Authentication Error"));
			}
			res.json(todo ? todo.toJSON() : {});
		})
		.catch((err: Error) => next(err));
});

export default router;
