import { Inject, Injectable } from "@nestjs/common";
import { IBaseService } from "src/core-domain/application-service/base.service";
import { HttpClient } from "src/infrastructure/client/http.client";
import { BankingDate } from "../models/banking-date.model";
import { DefaultShop } from "../models/user-shop.model";


@Injectable()
export default class GetBankingDateService implements IBaseService<number, BankingDate> {
    constructor(private httpclient: HttpClient) {
        console.log('FetchShopService created')
    }
    async handle(input: number): Promise<BankingDate> {
        let bd: BankingDate
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        await this.httpclient.get('shop/getBankingDate/' + input).then(res => {

            const { bankingDate } = res.data
            const dif = diffDays(new Date(bankingDate), new Date());

            if (dif > 2) {
                console.log('diff', dif);
                var days: number
                days = +dif - 1
                var status = 'Banking date is ' + days + ' days older than current date'
                bd = new BankingDate(bankingDate, status)
            }
            return bd;
        })
        return bd;
    }
}