import * as winston from "winston";
import * as Transport from "winston-transport";
const {combine, json, colorize} = winston.format;

/* tslint:disable */
const path = require("path");
/* tslint:enable */

const activeTransports: Transport[] = [new winston.transports.Console()];

if (process.env.LOG_DIR) {
	activeTransports.push(
		new winston.transports.File({filename: path.join(process.env.LOG_DIR, "error.log"), level: "error"}),
	);
}

export const logger = winston.createLogger({
	level: "info",
	format: combine(
		json(),
		colorize(),
	),
	transports: activeTransports,
});
