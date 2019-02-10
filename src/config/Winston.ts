import * as path from 'path'
import * as Winston from "winston";
import { StreamOptions } from "morgan";
import { TransformableInfo, Format } from 'logform';

// define the custom settings for each transport (file, console)
let options = {
	file: {
		level: 'info',
		filename: path.resolve(__dirname, '..', '..', 'logs', 'app.log'),
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	testFile: {
		level: 'info',
		filename: path.resolve(__dirname, '..', '..', 'logs', 'testing.log'),
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true,
	},
};

// instantiate a new Winston Logger with the settings defined above
let Logger = Winston.createLogger({
	transports: process.env.NODE_ENV !== 'test' ? [
		new Winston.transports.File(options.file),
		new Winston.transports.Console(options.console)
	] : [
		new Winston.transports.File(options.testFile),
	],
	level: process.env.LOG_LEVEL || 'info',
	format: getFormat(),
	exitOnError: false, // do not exit on handled exceptions
});

function getFormat() : Format {
	if (process.env.NODE_ENV === 'production') {
		return prodFormat();
	} else {
		return devFormat();
	}
}

function prodFormat() {
	const replaceError = (error: Error) => { 
		return {
			label: error.name, 
			level: "error", 
			message: error.message, 
			stack: error.stack
		};
	}
	const replacer = (key: string, value: any) => value instanceof Error ? replaceError(value) : value;
	return Winston.format.combine(Winston.format.label({ label: 'ssr server log' }), Winston.format.json({ replacer }));
}

function devFormat() {
	const formatMessage = (info : TransformableInfo) => `${info.level} ${info.message}`;
	const formatError = (info : TransformableInfo) => `${info.level} ${info.message}\n\n${info.stack}\n`;
	const format = (info : TransformableInfo) => info instanceof Error ? formatError(info) : formatMessage(info);
	return Winston.format.combine(Winston.format.colorize(), Winston.format.printf(format))
}

// create a stream object with a 'write' function that will be used by `morgan`
let Stream : StreamOptions = {
	write: function(message: string) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		Logger.info(message);
	},
};

export { Stream, Logger }