import * as express from "express";
import * as Passport from "passport";

const router = express.Router();

router.get("/", (req: any, res: express.Response, next: express.NextFunction) => {
	// returns info about the currently logged in user
	res.json({ user: req.user ? req.user.toJSON() : {}});
});

/**
 * Takes post body of {email: 'something@email.com', password: '123456'}
 */
router.post("/", (req: any, res: express.Response, next: express.NextFunction) => {
	if (!Object.keys(req.body).length) {
		throw new Error("Missing Request Body");
	}
	if (!req.body.email || !req.body.password) {
		throw new Error("Missing email or password field(s).");
	}

	Passport.authenticate("login", (err, user) => {
		if (err) { return next(err); }
		if (!user) { return next(new Error("login failed")); }
		req.logIn(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			res.json({ user: req.user ? req.user.toJSON() : {}});
		});
	})(req, res, next);
});

router.delete("/", (req: any, res: express.Response, next: express.NextFunction) => {
	req.logout();
	res.sendStatus(200);
});

export default router;
