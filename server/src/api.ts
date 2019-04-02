import * as express from "express";
import authRouter from "./components/auth/authRouter";
import forgotPasswordRouter from "./components/forgot-password/forgotPasswordRouter";
import resetPasswordRouter from "./components/reset-password/resetPasswordRouter";
import usersRouter from "./components/users/usersRouter";
import todosRouter from "./components/todos/todosRouter";
const router = express.Router();

router.get("/", function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.json({ hello: "world?"});
});

router.use("/auth/", authRouter);
router.use("/users/", usersRouter);
router.use("/todos/", todosRouter);
router.use("/forgot-password/", forgotPasswordRouter);
router.use("/reset-password/", resetPasswordRouter);

export default router;
