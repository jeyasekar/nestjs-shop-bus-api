import { HttpService } from "@nestjs/axios";
import axios, { AxiosRequestConfig } from "axios";
import { ConfigService } from "../configuration/config.service";
import { ShopSettingConstants } from "../constants/shop-setting";
import { Injectable } from "@nestjs/common";



@Injectable()
export class HttpClient {

  constructor(private httpService: HttpService) {
    console.log("Httpclient object created")
  }

  public async get(url: string) {

    let responsedata: any
    var baseUrl = ConfigService.create().getBaseURl(ShopSettingConstants.MASTER_BASE_URL)

    console.log("URl :", baseUrl + url)
    var env = ConfigService.create().isProduction();
    if (env) {

      console.log("Enter into production Block")
      const tokenObservable = this.getIdentityToken(baseUrl);
      console.log(tokenObservable)
      await tokenObservable.subscribe(response => {
        var token = response.data;
        console.log("token :", token)

        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }

        responsedata = axios.get(baseUrl + url,requestConfig)
      });
    } else {
      console.log("Enter into Dev Block")
      responsedata = await axios.get(baseUrl + url)
    }
    console.log('responsedata', responsedata.data)
    return responsedata;
  }

  private getIdentityToken(recipientUrl) {
    /*if (
      process.env.GCP_IDENTITY_TOKEN &&
      isActive(process.env.GCP_IDENTITY_TOKEN)
    ) {
      return process.env.GCP_IDENTITY_TOKEN;
    }*/
    const requestConfig: AxiosRequestConfig = {
      params: {
        audience: recipientUrl,
      },
      headers: {
        'metadata-flavor': 'Google',
      }
    }
    return this.httpService.get(process.env.GCP_IDENTITY_TOKEN_URL, requestConfig);
  }

}
