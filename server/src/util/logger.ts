import * as winston from "winston";
import * as Transport from "winston-transport";

const {combine, timestamp, colorize, logstash, align, printf} = winston.format;

/* tslint:disable */
const path = require("path");
/* tslint:enable */

const activeTransports: Transport[] = [new winston.transports.Console({handleExceptions: true})];

const logLevel = process.env.LOG_LEVEL || "info";

if (process.env.LOG_DIR) {
	activeTransports.push(
		new winston.transports.File({filename: path.join(process.env.LOG_DIR, "error.log"), level: "error"}),
	);
}

const loggingFormat = process.env["NODE_ENV"] === "development" ?
	combine(
		colorize({all: true}),
		timestamp(),
		align(),
		printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
	) :
	combine(
		timestamp(),
		logstash(),
	);

export const logger = winston.createLogger({
	level: logLevel,
	format: loggingFormat,
	transports: activeTransports,
});

export const infoStream = {
	write: (text: string) => {
		logger.info(text.trim());
	},
};

export const errorStream = {
	write: (text: string) => {
		logger.error(text.trim());
	},
};
