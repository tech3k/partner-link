import { ObjectToXmlTransformer, Transformer, XmlToObjectTransformer } from './transformer';

export class RemainingCreditsTransformer extends Transformer
implements ObjectToXmlTransformer {
    public item(): string {
        return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetLightSearchCreditsLeft xmlns="http://searchlink.co.uk/">
          <cred>
            <Client>${this.credentials.creditSearchClient}</Client>
            <UserName>${this.credentials.creditSearchUsername}</UserName>
            <Password>${this.credentials.creditSearchPassword}</Password>
          </cred>
        </GetLightSearchCreditsLeft>
      </soap:Body>
    </soap:Envelope>`;
    }

    items(object: any[]): string {
        return '';
    }
}

export class RemainingCreditsResultTransformer extends Transformer implements XmlToObjectTransformer {

    public xmlItem(xml: string): Promise<string> {
      return Promise.resolve(xml)
        .then(raw => this.parseXml(raw))
        .then(parsedResult => {
            return parsedResult['soap:Envelope']['soap:Body'][0]
              .GetLightSearchCreditsLeftResponse[0].GetLightSearchCreditsLeftResult[0];
          })
    }
  
    public xmlItems(xml: string): Promise<string[]> {
      return Promise.resolve([]);
    }
  }