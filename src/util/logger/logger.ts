import {createLogger, Logger as WLogger, transports, format} from 'winston';
import {Config} from '../config';

export class Logger {
  private _logger: WLogger;
  constructor(private config: Config) {
    this.config = config;
    this._logger = createLogger({
      level: config.logLevel,
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
            format.timestamp(),
            format.printf(
              info => `${info.timestamp} ${info.level}: ${info.message}`
            )
          ),
        }),
      ],
    });
  }

  info(message: string) {
    this._logger.info(message);
  }

  error(message: string) {
    this._logger.error(message);
  }

  warn(message: string) {
    this._logger.warn(message);
  }

  debug(message: string) {
    this._logger.debug(message);
  }

  verbose(message: string) {
    this._logger.verbose(message);
  }
}
