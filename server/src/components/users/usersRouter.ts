import * as express from "express";
import {adminAuthMiddleware, authMiddleware} from "../auth";
import UsersController from "./index";
import TodosController from "../todos/index";

const router = express.Router();
const usersController = new UsersController();
const todosController = new TodosController();

// only admin users may access this route
router.get("/", adminAuthMiddleware, (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return usersController.getUsers()
		.then((users) => res.json(users ? users.toJSON() : []))
		.catch((err: Error) => next(err));
});

// any authenticated user may access this route with their own ID
router.get("/:id", authMiddleware, (req: any, res: express.Response, next: express.NextFunction) => {
	// only admins are allowed to get info on other users
	if ((req.user.get("id") !== req.params.id) && !req.user.get("is_admin")) {
		return next(new Error("Authentication Error"));
	}
	console.log("id", req.params.id);
	return usersController.getUser(req.params.id)
		.then((user) => res.json(user ? user.toJSON() : {}))
		.catch((err: Error) => next(err));
});

router.get("/:id/todos", authMiddleware, (req: any, res: express.Response, next: express.NextFunction) => {
	// only admins are allowed to get info on other users
	if ((req.user.get("id") !== req.params.id) && !req.user.get("is_admin")) {
		return next(new Error("Authentication Error"));
	}

	return todosController.getTodosByUser(req.params.id)
		.then((user) => res.json(user ? user.toJSON() : {}))
		.catch((err: Error) => next(err));
});

// you do not need to be authenticated to register an account
router.post("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return usersController.createUser(req.body)
		.then((user) => res.json(user ? user.toJSON() : {}))
		.catch((err: Error) => next(err));
});

export default router;
