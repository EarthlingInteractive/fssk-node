import * as express from "express";
import * as Passport from "passport";
import ForgotPasswordController from "./index";

const router = express.Router();
const forgotPasswordController = new ForgotPasswordController();

/**
 * Takes post body of {email: 'something@email.com'} and ip address
 */
router.post("/", (req: any, res: express.Response, next: express.NextFunction) => {
	if (!Object.keys(req.body).length) {
		throw new Error("Missing Request Body");
	}
	if (!req.body.email) {
		throw new Error("Missing email field(s).");
	}

	// Get the ip address of this requester
	const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress

	forgotPasswordController.createForgotPasswordToken(req.body, ipAddress)
		.then((token) => res.json(token ? token : []))
		.catch((err: Error) => next(err));
});

export default router;