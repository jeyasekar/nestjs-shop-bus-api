import { Controller, Get, Param } from "@nestjs/common";
import FetchShopService from "src/core-domain/application-service/fetchshop.service";
import GetBankingDateService from "src/core-domain/application-service/getbanking-date.service";
import { WinstonLoggerService } from "src/infrastructure/logger/winston-logger.service";


@Controller()
export class ShopController {
    constructor(
        private shopService: FetchShopService,
        private bankingDateService: GetBankingDateService,
        private logger: WinstonLoggerService,) {
        this.logger.setContext(ShopController.name);
        console.log('shop service controller created')
    }


    @Get('shop/getShops/:marketName/:companyId/:userId')
    getShopList(@Param() params) {
        this.logger.info('in fetchMasterData info #Market ${marketName}  #CompanyId ${companyId} #User ${userId}');
        this.logger.error('in fetchMasterData error', { key: 'value' });
        this.logger.debug('in fetchMasterData debug', { key: 'value' });
        this.logger.warn('in fetchMasterData warn');
        console.log('shop service controller getShopList method', params.marketName, params.companyId, params.userId)

        return this.shopService.handle(params)

    }

    @Get('shop/getBankingDate/:shopNo')
    getShopBankingDate(@Param('shopNo') shopNo: number) {
        console.log('shop service controller getShopBankingDate method', shopNo)
        return this.bankingDateService.handle(shopNo)

    }
}