var parseString = require('xml2js').parseString;

import { AcceptsCredentials } from "../services/credentials";

export class Transformer extends AcceptsCredentials {
  protected parseXml(xml: string): Promise<any> {
    return new Promise((resolve,reject) => {
      parseString(xml, function (err, result) {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  }
}

export interface XmlToObjectTransformer {
  xmlItems(xml: string): Promise<any[]>;
  xmlItem(xml: string): Promise<any>;
}

export interface ObjectToXmlTransformer {
  item(object: any): string;
}
