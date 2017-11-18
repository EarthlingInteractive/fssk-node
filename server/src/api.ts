import * as express from "express";
import authRouter from "./components/auth/authRouter";
import usersRouter from "./components/users/usersRouter";
const router = express.Router();

router.get("/", function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.json({ hello: "world!"});
});

router.use("/auth/", authRouter);
router.use("/users/", usersRouter);

export default router;
