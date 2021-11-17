import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm'
import * as dotenv from 'dotenv'
//import { OrderSettingConstants } from '../constants/shop-setting';


dotenv.config()
type envConfigType = {
    [key: string]: string | undefined
}

export class ConfigService {
    private static svc: ConfigService;
    static create() {
        if (!this.svc) {
            this.svc = new ConfigService(process.env)
        }
        return this.svc
    }

    private constructor(private env: envConfigType) {
        console.log('svc created')
    }

    private getValue(key: string, throwOnMissing = true): string {
        // console.log('+++++this.env',this.env)
        const value = process.env[key]
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`)
        }

        return value
    }

    public getPort() {
        return this.getValue('API_GATEWAY_PORT', true)
    }
    public isProduction() {
        const mode = this.getValue('MODE', false)
        return mode != 'DEV'
    }
    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true))
        return this
    }

    public getBaseURl(key: string) {
        return this.getValue(key, true)
    }

    public getLogLevel(): string {
        const level = this.getValue('ORDER_LOG_LEVEL', false)
        return level
    }

}
