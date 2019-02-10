import * as path from 'path'
import * as Winston from "winston";
import { StreamOptions } from "morgan";

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
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
let logger = Winston.createLogger({
  transports: [
    new Winston.transports.File(options.file),
    new Winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
let stream : StreamOptions = {
  write: function(message: string) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

export default stream