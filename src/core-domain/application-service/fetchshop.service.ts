import { HttpException, Inject, Injectable } from "@nestjs/common";
import { IBaseService } from "src/core-domain/application-service/base.service";
import { HttpClient } from "src/infrastructure/client/http.client";
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
                throw new HttpException("You dont have access. Please check your selection", 401)
            }
            console.log('+++SSSDS', ds)
        })
        return ds;
    }
}