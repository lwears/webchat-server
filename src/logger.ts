import { createLogger, format, transports } from 'winston';
import appRoot from 'app-root-path';

const { File, Console } = transports;

const fileFormat = format.combine(format.timestamp(), format.json());

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: fileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  transports: [new File(options.file), new Console(options.console)],
  exitOnError: false,
});

export default logger;
