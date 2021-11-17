import { DynamicModule, Module } from '@nestjs/common';
import {
  WinstonLoggerModuleAsyncOptions,
  WinstonLoggerModuleOptions,
} from './interfaces/winston-logger-options.interface';
import { WINSTON_LOGGER_MODULE_OPTIONS } from './winston-logger.constants';
import { WinstonLoggerService } from './winston-logger.service';

@Module({})
export class WinstonLoggerModule {
  static forRoot(options: WinstonLoggerModuleOptions): DynamicModule {
    const { isGlobal, ...useValue } = options;

    return {
      module: WinstonLoggerModule,
      global: isGlobal,
      providers: [
        { provide: WINSTON_LOGGER_MODULE_OPTIONS, useValue },
        WinstonLoggerService,
      ],
      exports: [WinstonLoggerService],
    };
  }

  static forRootAsync(options: WinstonLoggerModuleAsyncOptions): DynamicModule {
    return {
      module: WinstonLoggerModule,
      global: options.isGlobal,
      imports: options.imports || [],
      providers: [
        {
          provide: WINSTON_LOGGER_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        WinstonLoggerService,
      ],
      exports: [WinstonLoggerService],
    };
  }
}