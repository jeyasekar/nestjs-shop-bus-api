import { ModuleMetadata } from '@nestjs/common';
import { LoggerOptions } from 'winston';
import winston from 'winston';

export interface WinstonLoggerModuleOptions extends LoggerOptions {
  isGlobal?: boolean;
  transports?: winston.LoggerOptions['transports'];

}

export interface WinstonLoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory?: (
    ...args: any[]
  ) => Promise<WinstonLoggerModuleOptions> | WinstonLoggerModuleOptions;
  inject?: any[];
}
