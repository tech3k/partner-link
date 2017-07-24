import { Transformer, XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { PartnerLinkError, CreditSearchAddressResult, CreditSearchAddress } from "../types";

export class CreditSearchAddressTransformer extends Transformer implements ObjectToXmlTransformer {
  public item(object: CreditSearchAddress): string {
    if (object.houseNumber === undefined || object.houseNumber === null || object.houseNumber.length === 0) {
      throw new PartnerLinkError('House Number is missing from the address.', 406);
    }

    if (object.street === undefined || object.street === null || object.street.length === 0) {
      throw new PartnerLinkError('Street is missing from the address.', 406);
    }

    if (object.postalCode === undefined || object.postalCode === null || object.postalCode.length === 0) {
      throw new PartnerLinkError('Postcode is missing from the address.', 406);
    }

    if (object.town === undefined || object.town === null || object.town.length === 0) {
      throw new PartnerLinkError('Town is missing from the address.', 406);
    }

    if (object.surname === undefined || object.surname === null || object.surname.length === 0) {
      throw new PartnerLinkError('Surname is missing from the address.', 406);
    }

    return `
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <SearchAddress xmlns="http://searchlink.co.uk/">
    <HouseNumber>${object.houseNumber}</HouseNumber>
    <PostCode>${object.postalCode}</PostCode>
    <Street>${object.street}</Street>
    <Town>${object.town}</Town>
    <Surname>${object.surname}</Surname>
    <cred>
      <Client>${this.credentials.creditSearchClient}</Client>
      <UserName>${this.credentials.creditSearchUsername}</UserName>
      <Password>${this.credentials.creditSearchPassword}</Password>
    </cred>
  </SearchAddress>
</soap:Body>
</soap:Envelope>
    `;
  }

  items(object: any[]): string {
    return '';
  }
}

export class CreditSearchAddressResultTransformer extends Transformer implements XmlToObjectTransformer {
  public xmlItem(xml: string): Promise<CreditSearchAddressResult> {
    return Promise.resolve(xml)
      .then(xml => this.parseXml(xml))
      .then(parsedResult => parsedResult["soap:Envelope"]["soap:Body"][0]["SearchAddressResponse"][0]["SearchAddressResult"][0])
      .then(singleResult => this.parseXml(singleResult))
      .then(parsedSingleResult => parsedSingleResult["Address"]["AddressMatch"][0]["$"])
      .then(address => {
        let returnAddress = new CreditSearchAddressResult;

        returnAddress.id = address["ptcabs"];
        returnAddress.address1 = `${address["HouseNumber"]} ${address["Street1"]}`;
        returnAddress.address2 = address["Street2"];
        returnAddress.town = address["Town"];
        returnAddress.postalCode = address["PostCode"];

        return returnAddress;
      })
  }

  public xmlItems(xml: string): Promise<CreditSearchAddressResult[]> {
    let parsedResults: string[] = [];

    return Promise.all(parsedResults.map(address => this.xmlItem(address)));
  }
}


export class AddAddressTransformer extends Transformer implements ObjectToXmlTransformer {
  public item(object: CreditSearchAddressResult, index: number): string {
    return `
<AddressDetails>
  <AddressLine1>${object.address1}</AddressLine1>
  <AddressLine2>${object.address2}</AddressLine2>
  <Applicant>1</Applicant>
  <Country>England</Country>
  <County>${object.county}</County>
  <Notes>Credit Check ${this.textFromNumber(index)} address</Notes>
  <Owner>Single</Owner>
  <PTCAB>${object.id}</PTCAB>
  <PostCode>${object.postalCode}</PostCode>
  <SearchNumber>1</SearchNumber>
</AddressDetails>
    `;
  }

  private textFromNumber(n: number): string {
    switch(n) {
      case 1:
        return "second";
      case 2:
        return "third";
      default:
        return "first";
    }
  }

  items(object: any[]): string {
    return `
<AddAddressesRequest>
  <Addresses>
    ${object.map((address,i) => this.item(address, i)).join("\n")}
  </Addresses>
  <Password>${this.credentials.password}</Password>
  <Username>${this.credentials.username}</Username>
</AddAddressesRequest>
    `;
  }
}
