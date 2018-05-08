import {CreditSearchAddress, CreditSearchAddressResult, PartnerLinkError,} from '../types';
import {ObjectToXmlTransformer, Transformer, XmlToObjectTransformer,} from './transformer';

export class CreditSearchAddressTransformer extends Transformer implements ObjectToXmlTransformer {
    public item(object: CreditSearchAddress): string {
        if (!object.houseNumber || object.houseNumber.length === 0) {
            throw new PartnerLinkError('House Number is missing from the address.', 406);
        }

        if (!object.street || object.street.length === 0) {
            throw new PartnerLinkError('Street is missing from the address.', 406);
        }

        if (!object.postalCode || object.postalCode.length === 0) {
            throw new PartnerLinkError('Postcode is missing from the address.', 406);
        }

        if (!object.town || object.town.length === 0) {
            throw new PartnerLinkError('Town is missing from the address.', 406);
        }

        if (!object.surname || object.surname.length === 0) {
            throw new PartnerLinkError('Surname is missing from the address.', 406);
        }

        const addressMatches = object.houseNumber.match(
            /((?:[F|f][l|L][a|A][t|T] )?[1-9]\d*[A-Za-z]?)[\s+|\S+]?([A-Za-z0-9 ]+)?/,
        );

        const houseNumber = addressMatches && addressMatches[1] ? addressMatches[1] : object.houseNumber;
        const streetName = addressMatches && addressMatches[2] ? addressMatches[2] : object.street;

        return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <SearchAddress xmlns="http://searchlink.co.uk/">
    <HouseNumber>${houseNumber}</HouseNumber>
    <PostCode>${object.postalCode}</PostCode>
    <Street>${streetName}</Street>
    <Town>${object.town}</Town>
    <Surname>${object.surname}</Surname>
    <cred>
      <Client>${this.credentials.creditSearchClient}</Client>
      <UserName>${this.credentials.creditSearchUsername}</UserName>
      <Password>${this.credentials.creditSearchPassword}</Password>
    </cred>
  </SearchAddress>
</soap:Body>
</soap:Envelope>`;
    }

    public items(object: any[]): string {
        return '';
    }
}

export class CreditSearchAddressResultTransformer extends Transformer implements XmlToObjectTransformer {

    public xmlItem(xml: any): Promise<CreditSearchAddressResult> {
        return Promise.resolve(xml)
            .then(xml => xml['$'])
            .then(address => {
                let returnAddress = new CreditSearchAddressResult();

                returnAddress.id = address['ptcabs'];
                returnAddress.address1 = `${address['HouseNumber']}`;
                returnAddress.address2 = address['Street1'];
                returnAddress.address3 = address['Street2'];
                returnAddress.town = address['Town'];
                returnAddress.postalCode = address['PostCode'];

                return returnAddress;
            });
    }

    public xmlItems(xml: string): Promise<any[]> {
        return Promise.resolve(xml)
            .then(xml => this.parseXml(xml))
            .then(parsedResult => parsedResult['soap:Envelope']['soap:Body'][0]['SearchAddressResponse'][0]['SearchAddressResult'])
            .then(singleResult => this.parseXml(singleResult))
            .then(parsedSingleResult => Promise.all(parsedSingleResult['Address']['AddressMatch'].map(this.xmlItem)))
            .then(allResults => allResults);
    }
}

export class AddAddressTransformer extends Transformer implements ObjectToXmlTransformer {

    public item(object: CreditSearchAddressResult, index: number) {
        if (!object.county) {
            throw new PartnerLinkError('County is missing from the address.', 406);
        }

        // let addressMatches = object.address1.match(/((?:[F|f][l|L][a|A][t|T] )?[1-9]\d*[A-Za-z]?)[\s+|\S+]?([A-Za-z0-9 ]+)?/);
        // let houseNumber = addressMatches[1];
        // let streetName = addressMatches[2] !== undefined ? addressMatches[2] : object.address2;

        return {
            AddressLine1: object.address1,
            AddressLine2: object.address2,
            Applicant: 1,
            Country: 'England',
            County: object.county,
            Notes: `Credit Check ${this.textFromNumber(index)} address`,
            Owner: 'Single',
            PTCAB: object.id,
            PostCode: object.postalCode,
            SearchNumber: 1,
        };
    }

    public items(object: any[]) {
        return {
            AddAddressesRequest: {
                Addresses: {
                    AddressDetails: object.map((address, i) => this.item(address, i)),
                },
                Password: this.credentials.password,
                Username: this.credentials.username,
            },
        };
    }

    private textFromNumber(n: number): string {
        switch (n) {
            case 1:
                return 'second';
            case 2:
                return 'third';
            default:
                return 'first';
        }
    }
}
