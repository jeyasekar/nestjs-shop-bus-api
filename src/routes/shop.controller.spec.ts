
import { Test } from "@nestjs/testing";
import { ShopController } from "./shop.controller";
import { WinstonLoggerModule } from "..//infrastructure/logger/winston.logger.module";

import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule, CacheInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import FetchShopService from "..//core-domain/application-service/fetchshop.service";
import GetBankingDateService from "..//core-domain/application-service/getbanking-date.service";
import { HttpClient } from "..//infrastructure/client/http.client";

jest.mock('..//core-domain/application-service/fetchshop.service')
jest.mock('..//core-domain/application-service/getbanking-date.service')
describe('ShopController', () => {
    let shopService: FetchShopService
    let bankingService: GetBankingDateService
    let shopController: ShopController;
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

        shopController = module.get<ShopController>(ShopController);
        shopService = module.get<FetchShopService>(FetchShopService)
        bankingService = module.get<GetBankingDateService>(GetBankingDateService)
    })
    it('getShopBankingDate Service to have been called', () => {
        let val = { marketName: 'GB', companyId: 1, userId: 'ext_sjeyasekar@pret.com' }

        expect(ShopController).toBeDefined();
        shopController.getShopList(val)
        expect(shopService.handle).toHaveBeenCalled();
        shopController.getShopBankingDate(127)
        expect(bankingService.handle).toHaveBeenCalled();
    });


});