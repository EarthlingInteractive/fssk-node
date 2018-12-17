import * as express from "express";
import ResetPasswordController from "./index";

const router = express.Router();
const resetPasswordController = new ResetPasswordController();

/**
 * Takes a request token and validates it
 */
router.get("/validate-token/:token", (req: any, res: express.Response, next: express.NextFunction) => {
	if (!Object.keys(req.params).length) {
		throw new Error("Missing Request Params");
	}

	if (!req.params.token) {
		throw new Error("Missing token field");
	}

	return resetPasswordController.validateResetToken(req.params.token)
		.then((validationResults) => res.json(validationResults ? validationResults : []))
		.catch((err: Error) => next(err));
});

router.post("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	return resetPasswordController.resetPassword(req.body)
		.then((user) => res.json(user))
		.catch((err: Error) => next(err));
});

export default router;