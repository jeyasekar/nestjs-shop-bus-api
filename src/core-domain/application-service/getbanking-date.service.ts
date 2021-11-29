import { Inject, Injectable } from "@nestjs/common";
import { IBaseService } from "..//..//core-domain/application-service/base.service";
import { HttpClient } from "..//..//infrastructure/client/http.client";
import { BankingDate } from "../models/banking-date.model";


@Injectable()
export default class GetBankingDateService implements IBaseService<number, BankingDate> {
    constructor(private httpclient: HttpClient) {
        console.log('FetchShopService created')
    }
    async handle(input: number): Promise<BankingDate> {
        let bd: BankingDate
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        await this.httpclient.get('shop/bankingdate/' + input).then(res => {
            let date = new Date();
            let dayOfWeekNumber = date.getDay();
            console.log('dayOfWeekNumber', dayOfWeekNumber)

            const { bankingDate, message } = res.data
            bd = new BankingDate(bankingDate, '')
            const dif = diffDays(new Date(bankingDate), new Date());
            // For 5 days shop validating banking date on monday
            if (dayOfWeekNumber === 1 && message === 5 && dif > 4) {
                bd = this.findDifference(dif, bd, bankingDate);
            } else if (dif > 2) {
                bd = this.findDifference(dif, bd, bankingDate);
            }
            return bd;
        })
        return bd;
    }

    private findDifference(dif: number, bd: BankingDate, bankingDate: any) {
        console.log('diff', dif);
        var days: number;
        days = +dif - 1;
        var status = 'Banking date is ' + days + ' days older than current date';
        bd = new BankingDate(bankingDate, status);
        return bd;
    }
}