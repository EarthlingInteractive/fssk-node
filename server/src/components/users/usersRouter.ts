import * as express from "express";
import {adminAuthMiddleware, authMiddleware} from "../auth";
import UsersController from "./index";
import TodosController from "../todos/index";
import Database from "../../database";
import * as ExpressBrute from "express-brute";
import * as BruteKnex from "brute-knex";
import * as Passport from "passport";

const router = express.Router();
const usersController = new UsersController();
const todosController = new TodosController();

const store = new BruteKnex({
	createTable: true,
	knex: Database.knex,
});
const bruteforce = new ExpressBrute(store, { freeRetries: 2, minWait: 300000 });

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
router.post("/register", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return usersController.createUser(req.body)
		.then((user) => res.json(user ? user.toJSON() : {}))
		.catch((err: Error) => next(err));
});

router.get("/resend-activation/:email", bruteforce.prevent,
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
	return usersController.resendActivationEmail(req.params.email)
		.then((user) => res.json(user ? user.toJSON() : {}))
		.catch((err: Error) => next(err));
});

router.get("/activate/:token", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return usersController.activateUser(req.params.token)
		.then((activationResults) => {
			if (activationResults && activationResults.isValid && activationResults.user) {
				req.login(activationResults.user, function(err) {
					if (err) { return next(err); }
					res.json(activationResults);
				});
			} else {
				res.json({isValid: false});
			}
		})
		.catch((err: Error) => next(err));
});

export default router;
