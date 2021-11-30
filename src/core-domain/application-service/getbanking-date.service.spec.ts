
import { Test } from "@nestjs/testing";

import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule, CacheInterceptor, INestApplication } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import FetchShopService from "./fetchshop.service";
import { WinstonLoggerModule } from "..//..//infrastructure/logger/winston.logger.module";
import { ShopController } from "..//..//routes/shop.controller";
import GetBankingDateService from "./getbanking-date.service";
import { HttpClient } from "..//..//infrastructure/client/http.client";
import { AxiosResponse } from "axios";
import { DefaultShop } from "../models/user-shop.model";
import Axios from 'axios';
jest.mock('Axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
describe('ShopBankingDate Service', () => {
    let bankingService: GetBankingDateService
    let app: INestApplication;
    beforeEach(async () => {


        const module = await Test.createTestingModule({
            imports: [
                HttpModule,
                WinstonLoggerModule.forRoot({ level: 'warn' }),
                CacheModule.register({
                    isGlobal: true,
                    ttl: 1, // in seconds
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
        }).compile();
        app = module.createNestApplication();
        await app.init();
        bankingService = module.get<GetBankingDateService>(GetBankingDateService)
    })
    it('getShopBankingDate Service to have been called', async () => {

        const result: AxiosResponse = await {
            data: { bankingDate: "11/22/21", message: 7 },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        };
        let data = result.data
        await mockedAxios.get.mockResolvedValue({ data });

        let ds: DefaultShop
        let results: any
        expect(GetBankingDateService).toBeDefined();
        results = await bankingService.handle(6)
        expect(results.bankingDate).toEqual(result.data.bankingDate)

    });


});