import { HttpException, Inject, Injectable } from "@nestjs/common";
import { IBaseService } from "..//../core-domain/application-service/base.service";
import { HttpClient } from "..//..//infrastructure/client/http.client";
import { ResponseCode } from "../../infrastructure/constants/response-code";
import { DefaultShop } from "../models/user-shop.model";


@Injectable()
export default class FetchShopService implements IBaseService<any, DefaultShop> {
    constructor(private httpclient: HttpClient) {
        console.log('FetchShopService created')
    }

    async handle(value: any): Promise<DefaultShop> {
        let ds: DefaultShop
        await this.httpclient.get('shop/stores/' + value.marketName + '/' + value.companyId + '/' + value.userId).then(res => {

            ds = res.data;
            if (ds.defaultShop?.code === undefined) {
                const msg = { code: ResponseCode.NO_ACCESS, message: 'You dont have access. Please check your selection' };
                throw new HttpException(msg, 404)
            }
            console.log('+++SSSDS', ds)
        })
        return ds;
    }
}