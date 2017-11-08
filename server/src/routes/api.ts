import * as express from "express";
const router = express.Router();

router.get("/", function(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.json({ hello: "world!"});
});

export default router;
