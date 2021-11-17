import { Inject, Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { WinstonLoggerModuleOptions } from './interfaces/winston-logger-options.interface';
import { WINSTON_LOGGER_MODULE_OPTIONS } from './winston-logger.constants';
import * as os from 'os';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService {
  private logger: winston.Logger;
  private context = '';

  constructor(
    @Inject(WINSTON_LOGGER_MODULE_OPTIONS)
    private options: WinstonLoggerModuleOptions,
  ) {
    const { level, format, transports, ...opts } = this.options;
    const myFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message} `
      if (metadata) {
        msg += JSON.stringify(metadata)
      }
      return msg
    });
    console.log('level', level)
    this.logger = winston.createLogger({
      level: level || 'info', // minimum logger level
      silent: options.silent || false, // logging will be disabled in testing,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.splat(),
        myFormat
      ),
      //format: format || winston.format.json(),
      transports: [new winston.transports.Console({ handleExceptions: true }), new (winston.transports.File)({ filename: 'app.log' })],
      //transports: transports || [new (winston.transports.Console)({ level: level || 'error' })],
      ...opts,
    });

    // this.logger.add(consoleTransport);

  }


  private logToWinston(level: LogLevel, message: string, ...meta: any): void {
    const logger = this.logger;
    if (logger) {
      logger.log({
        pid: process.pid,
        hostname: os.hostname(),
        level: level,
        message: message,
        context: this.context,
        ...(meta.length >= 1 && {
          extra: meta,
        }),
      });
    }
  }

  setContext(context: string) {
    this.context = context;
  }

  info(message?: string, meta?: any) {
    this.logToWinston('info', message, meta);
  }

  //this.logger.debug(message, { context: `${this.context}.${context}` });
  debug(message?: string, meta?: any) {
    this.logToWinston('debug', message, meta);
  }

  warn(message?: string, meta?: any) {
    this.logToWinston('warn', message, meta);
  }

  error(message?: string, meta?: any) {
    this.logToWinston('error', message, meta);
  }

}



export const consoleTransport = new winston.transports.Stream({
  stream: process.stdout,
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.json({ space: 2 }),
    winston.format.logstash(),
    winston.format.metadata(),
  ),
});

export type LogLevel =
  | 'error'
  | 'warn'
  | 'verbose'
  | 'info'
  | 'debug'
  | 'silly';