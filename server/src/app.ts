import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as mustacheExpress from "mustache-express";
import * as path from "path";
import AuthController from "./components/auth";
import api from "./api";
import {infoStream, errorStream, logger} from "./util/logger";

const environment = process.env["NODE_ENV"];

const app: express.Application = express();

// include mustache template engine
app.engine("mst", mustacheExpress());
app.set("views", __dirname + "/views");
app.set("view engine", "mst");

// request logging
const morganFormat = (environment === "development") ? "dev" : "combined";
app.use(morgan(morganFormat, {
	skip: (req, res) => {
		return res.statusCode < 400;
	},
	stream: errorStream,
}));
app.use(morgan(morganFormat, {
	skip: (req, res) => {
		return res.statusCode >= 400;
	},
	stream: infoStream,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authController = new AuthController();
authController.initialize(app);

app.use("/api/", api);

// catch 404 api calls and forward to error handler
app.use("/api/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const err = new Error("Not Found");
	err["status"] = 404;
	next(err);
});

// in prod, serve up static client-side files
if (environment === "production") {
	const clientDir = path.resolve(__dirname, "../client");
	app.use(express.static(clientDir));

	// send unhandled URLs to index.html so that react router can handle them
	app.get("/*", function(req: express.Request, res: express.Response) {
		res.sendFile(path.join(clientDir, "index.html"));
	});
}

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

	// set locals, only providing error in development
	res.locals.message = err.message || "Unknown error occurred";
	res.locals.error = environment === "development" ? err : "";
	const errStatus = err.status || 500;

	const ipAddr = req.ip || (req.connection && req.connection.remoteAddress) || undefined;
	const url = req.originalUrl || req.url;
	logger.error(`${ipAddr} - "${req.method} ${url}" ${res.locals.message} - ${err}`);

	// render the error page
	res.status(errStatus);
	if (req.get("Content-Type") === "application/json") {
		const errorJson: any = {
			code: errStatus,
			message: res.locals.message,
			error: res.locals.error,
		};
		res.json(errorJson);
	} else {
		res.render("error");
	}

});

module.exports = app;
