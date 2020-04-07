import { CreditSearchPerson, CreditSearchPersonResult, PartnerLinkError } from '../types';
import { CreditorTransformer } from './creditor';
import { ObjectToXmlTransformer, Transformer, XmlToObjectTransformer } from './transformer';

export class CreditSearchPersonTransformer extends Transformer
  implements ObjectToXmlTransformer {
  public item(object: CreditSearchPerson): string {
    if (!object.addresses || object.addresses.length === 0) {
      throw new PartnerLinkError('No addresses given.', 406);
    }

    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetLightSearchAccountDataWithCreditSearchID xmlns="http://searchlink.co.uk/">
      <ClientReference>${object.clientReference}</ClientReference>
      <Title>${object.title ? object.title : ''}</Title>
      <Forename>${object.firstName}</Forename>
      <Surname>${object.lastName}</Surname>
      <DateOfBirth>${object.dateOfBirth.format('YYYY-MM-DD')}</DateOfBirth>
      <PTCAB1>${object.addresses[0] ? object.addresses[0].id : ''}</PTCAB1>
      <HouseNumber1>${object.addresses[0] ? object.addresses[0].address1 : ''}</HouseNumber1>
      <PostCode1>${object.addresses[0] ? object.addresses[0].postalCode : ''}</PostCode1>
      <Town1>${object.addresses[0] ? object.addresses[0].town : ''}</Town1>
      <StreetName1>${object.addresses[0] ? object.addresses[0].address2 : ''}</StreetName1>
      <PTCAB2>${object.addresses[1] ? object.addresses[1].id : ''}</PTCAB2>
      <HouseNumber2>${object.addresses[1] ? object.addresses[1].address1 : ''}</HouseNumber2>
      <PostCode2>${object.addresses[1] ? object.addresses[1].postalCode : ''}</PostCode2>
      <Town2>${object.addresses[1] ? object.addresses[1].town : ''}</Town2>
      <StreetName2>${object.addresses[1] ? object.addresses[1].address2 : ''}</StreetName2>
      <PTCAB3>${object.addresses[2] ? object.addresses[2].id : ''}</PTCAB3>
      <HouseNumber3>${object.addresses[2] ? object.addresses[2].address1 : ''}</HouseNumber3>
      <PostCode3>${object.addresses[2] ? object.addresses[2].postalCode : ''}</PostCode3>
      <Town3>${object.addresses[2] ? object.addresses[2].town : ''}</Town3>
      <StreetName3>${object.addresses[2] ? object.addresses[2].address2 : ''}</StreetName3>
      <cred>
        <Client>${this.credentials.creditSearchClient}</Client>
        <UserName>${this.credentials.creditSearchUsername}</UserName>
        <Password>${this.credentials.creditSearchPassword}</Password>
      </cred>
    </GetLightSearchAccountDataWithCreditSearchID>
  </soap:Body>
</soap:Envelope>`;
  }

  items(object: any[]): string {
    return '';
  }
}

export class CreditReportTransformer extends Transformer {
  public item(id: number): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetLightSearchCreditReportHTML xmlns="http://searchlink.co.uk/">
      <creditSearchID>${id}</creditSearchID>
      <cred>
        <Client>${this.credentials.creditSearchClient}</Client>
        <UserName>${this.credentials.creditSearchUsername}</UserName>
        <Password>${this.credentials.creditSearchPassword}</Password>
      </cred>
    </GetLightSearchCreditReportHTML>
  </soap:Body>
</soap:Envelope>`;
  }

  public getHtmlFromResult(xml: string): Promise<string> {
    return Promise.resolve(xml)
      .then(raw => this.parseXml(raw))
      .then(
        parsedResult =>
          parsedResult['soap:Envelope']['soap:Body'][0][
            'GetLightSearchCreditReportHTMLResponse'
            ][0]['GetLightSearchCreditReportHTMLResult'][0],
      )
      .then(singleResult =>
        Buffer.from(singleResult, 'base64').toString('ascii'),
      );
  }
}

export class CreditSearchPersonResultTransformer extends Transformer
  implements XmlToObjectTransformer {
  public xmlItem(xml: string): Promise<CreditSearchPersonResult> {
    return Promise.resolve(xml)
      .then(raw => this.parseXml(raw))
      .then(
        parsedResult =>
          parsedResult['soap:Envelope']['soap:Body'][0]
            .GetLightSearchAccountDataWithCreditSearchIDResponse[0]
            .GetLightSearchAccountDataWithCreditSearchIDResult[0],
      )
      .then(singleResult => this.parseXml(singleResult))
      .then(parsedSingleResult => parsedSingleResult.Account)
      .then(personResult => {
        const returnPersonResult = new CreditSearchPersonResult();
        returnPersonResult.id = parseInt(personResult.$.ID, 10);
        returnPersonResult.creditors = (personResult.AccountData || []).map(
          creditor =>
            new CreditorTransformer(this.credentials).parseXmlItem(creditor.$),
        );
        return returnPersonResult;
      });
  }

  public xmlItems(xml: string): Promise<CreditSearchPersonResult[]> {
    const parsedResults: string[] = [];

    return Promise.all(parsedResults.map(address => this.xmlItem(address)));
  }
}
