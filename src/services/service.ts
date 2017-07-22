import * as request from "request-promise-native";

import { AcceptsCredentials } from "./credentials";
import { PartnerLinkCredentials, PartnerLinkError } from "../types";

export class Service extends AcceptsCredentials {

  protected soapRequest(body: string, credentialUrl: string, path: string, action: string): Promise<any> {
    let options: any = {
      method: 'POST',
      uri: `https://${this.credentials[credentialUrl]}/${path}`,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": action
      },
      json: false,
      body: this.stripEmptyLines(body)
    };

    return request(options);
  }

  protected getRquest(): Promise<any> {
    return request({
      method: 'GET',
      uri: this.credentials.url
    });
  }

  protected postRequest(): Promise<any> {
    return request({
      method: 'POST',
      uri: this.credentials.url
    });
  }

  private stripEmptyLines(data: string): string {
    return data.replace(/^\s*[\r\n]/gm, "")
  }

}
