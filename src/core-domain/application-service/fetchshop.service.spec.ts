
import { Test } from "@nestjs/testing";

import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheInterceptor, INestApplication } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import FetchShopService from "./fetchshop.service";
import { WinstonLoggerModule } from "..//..//infrastructure/logger/winston.logger.module";
import { ShopController } from "..//..//routes/shop.controller";
import GetBankingDateService from "./getbanking-date.service";
import { HttpClient } from "..//..//infrastructure/client/http.client";
import { AxiosResponse } from "axios";
import Axios from 'axios';
jest.mock('Axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
describe('FetchShopService', () => {
    let shopService: FetchShopService
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
        shopService = module.get<FetchShopService>(FetchShopService)
    })
    it('FetchShopService Service to have been called', async () => {

        const result: AxiosResponse = await {
            data: { defaultShop: { "code": "606", "name": "Moto Rugby" }, shops: [{ "code": "604", "name": "Cherwell Valley" }] },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        };
        let data = result.data
        await mockedAxios.get.mockResolvedValue({ data });
        let val = { marketName: 'GB', companyId: 3, userId: 'ext_sjeyasekar@pret.com' }
        let results: any
        expect(FetchShopService).toBeDefined();
        results = await shopService.handle(val)
        expect(results).toEqual(result.data)

    });


});