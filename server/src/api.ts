import * as express from "express";
import authRouter from "./components/auth/authRouter";
import usersRouter from "./components/users/usersRouter";
import todosRouter from "./components/todos/todosRouter";
const router = express.Router();

router.get("/", function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.json({ hello: "world!"});
});

router.use("/auth/", authRouter);
router.use("/users/", usersRouter);
router.use("/todos/", todosRouter);

export default router;
