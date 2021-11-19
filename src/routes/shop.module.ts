import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpClient } from 'src/infrastructure/client/http.client';
import FetchShopService from 'src/core-domain/application-service/fetchshop.service';
import { ShopController } from './shop.controller';
import { ConfigService } from 'src/infrastructure/configuration/config.service';
import { WinstonLoggerModule } from 'src/infrastructure/logger/winston.logger.module';
import GetBankingDateService from 'src/core-domain/application-service/getbanking-date.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [
        HttpModule,
        WinstonLoggerModule.forRoot({ level: ConfigService.create().getLogLevel() }),
        CacheModule.register({
            isGlobal: true,
            ttl: 3600, // in seconds - 1hr
            max: 10, // maximum number of items in cache
        })

    ],
    controllers: [ShopController],
    providers: [
        FetchShopService,
        GetBankingDateService,
        HttpClient,
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class ShopModule {
    constructor() {
        console.log('ShopModule created')
    }
};