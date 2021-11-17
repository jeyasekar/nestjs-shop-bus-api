import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpClient } from 'src/infrastructure/client/http.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import FetchShopService from 'src/core-domain/application-service/fetchshop.service';
import { ShopController } from './shop.controller';
import { ConfigService } from 'src/infrastructure/configuration/config.service';
import { WinstonLoggerModule } from 'src/infrastructure/logger/winston.logger.module';
import GetBankingDateService from 'src/core-domain/application-service/getbanking-date.service';

@Module({
    imports: [
        HttpModule,
        WinstonLoggerModule.forRoot({ level: ConfigService.create().getLogLevel() }),
    ],
    controllers: [ShopController],
    providers: [
        FetchShopService,
        GetBankingDateService,
        HttpClient
    ],
})
export class ShopModule {
    constructor() {
        console.log('ShopModule created')
    }
};