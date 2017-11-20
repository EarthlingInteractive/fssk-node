import * as bcrypt from "bcrypt";
import * as ConnectSessionKnex from "connect-session-knex";
import * as express from "express";
import * as ExpressSession from "express-session";
import * as Passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import UsersController from "../users";
import Database from "../../database";

const usersController = new UsersController();
const knexSessionStore = ConnectSessionKnex(ExpressSession);
const store = new knexSessionStore({
	knex: Database.knex,
	tablename: "sessions",
});

export default class AuthController {

	protected signingSecret: string = process.env["SIGNING_SECRET"] || "this is our secret";


	public initialize(app: express.Application) {
		this.configureSessions(app);

		Passport.use("login", new LocalStrategy({
				usernameField: "email",
				passwordField: "password",
			},
			this.verifyLogin,
		));
	}

	public verifyLogin(email: string, password: string, done) {
		// check in DB if a user with email exists or not
		usersController.getUserByEmail(email)
		.then((user) => {
			if (!user) {
				return done(null, false);
			}

			bcrypt.compare(password, user.get("password"), (compErr: any, match: any) => {
				if (compErr || !match) {
					return done(null, false);
				}
				return done(null, user);
			});
		})
		.catch(done);
	}

	protected configureSessions(app: express.Application) {
		if (!this.signingSecret) {
			throw new Error("No SIGNING_SECRET environment variable defined for sessions");
		}

		// plug in middleware for sessions
		app.use(ExpressSession({
			secret: this.signingSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				maxAge: 1000 * 60 * 15,  // expire cookie after 15 minutes of inactivity
				secure: false, // setting true means the cookie is never sent unless https which breaks local dev
			},
			rolling: true, // extend the life of the session cookie every time it is used
			store,
		}));

		// if we want the session cookie to last for however long the browser is open, all we have to do is change the
		// settings above by removing maxAge and rolling and set cookie.expires: false.
		// this can also be done on a per request basis by setting req.session.cookie.expires = false

		app.use(Passport.initialize());
		app.use(Passport.session());

		Passport.serializeUser((user: any, done) => {
			done(null, user.id);
		});

		Passport.deserializeUser((id: any, done) => {
			console.log('poo', id);
			usersController.getUser(id)
				.then((user) => {
					done(null, user || {});
				})
				.catch(done);
		});
	}
}

export function authMiddleware(req: any, res: express.Response, next: express.NextFunction) {
	if (!req.isAuthenticated()) {
		return next(new Error("Authentication Error Occurred"));
	}
	return next();
}

export function adminAuthMiddleware(req: any, res: express.Response, next: express.NextFunction) {
	if (!req.isAuthenticated() || !req.user) {
		return next(new Error("Authentication Error Occurred"));
	} else if (!req.user.get("is_admin")) {
		return next(new Error("administrator privileges required"));
	}
	return next();
}

