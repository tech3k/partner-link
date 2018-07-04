import * as xml2js from 'xml2js';
import * as request from 'request-promise-native';
import { AcceptsCredentials } from './credentials';
import { PartnerLinkCredentials, PartnerLinkError } from '../types';

export class Service extends AcceptsCredentials {
  private jwt: string = undefined;

  constructor(credentials: PartnerLinkCredentials) {
    super(credentials);
    this.getJwt();
  }

  protected soapRequest(
    body: string,
    credentialUrl: string,
    path: string,
    action: string,
  ): Promise<any> {
    const options: any = {
      method: 'POST',
      uri: `https://${this.credentials[credentialUrl]}/${path}`,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': action,
      },
      json: false,
      body: this.stripEmptyLines(body),
    };

    this.log('soapRequest', options);
    return request(options).then(result => {
      this.log('soapRequest: response', result);
      return result;
    });
  }

  protected async tokenPostRequest(
    body: string,
    credentialUrl: string,
    path: string,
  ): Promise<any> {
    const options = {
      method: 'POST',
      uri: `https://${this.credentials[credentialUrl]}/${path}`,
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Bearer ' + (this.jwt ? this.jwt : await this.getJwt()),
      },
      json: false,
      body: this.stripEmptyLines(body),
    };

    this.log('tokenPostRequest', options);

    return request(options).then(result => {
      this.log('tokenPostRequest: response', result);
      return result;
    });
  }

  protected postRequest(
    body: string,
    credentialUrl: string,
    path: string,
  ): Promise<any> {
    const options = {
      method: 'POST',
      uri: `https://${this.credentials[credentialUrl]}/${path}`,
      headers: {
        'Content-Type': 'text/xml',
      },
      json: false,
      body: this.stripEmptyLines(body),
    };
    this.log('postRequest', options);
    return request(options).then(result => {
      this.log('postRequest: response', result);
      return result;
    });
  }

  protected log(...messages: any[]) {
    if (this.credentials.debug) {
      console.log(...messages);
    }
  }

  private getJwt(): Promise<string> {
    const options = {
      method: 'POST',
      uri: `https://${this.credentials.url}/Token`,
      json: true,
      form: {
        grant_type: 'password',
        username: this.credentials.username,
        password: this.credentials.password,
      },
    };
    return request(options)
      .then(result => {
        this.jwt = result.access_token;
        return this.jwt;
      });
  }

  protected parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  private stripEmptyLines(data: string): string {
    return data.replace(/^\s*[\r\n]/gm, '');
  }
}
