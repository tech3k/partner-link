import {
  CreditSearchPersonResultTransformer,
  CreditSearchPersonTransformer,
} from './person';
import {
  CreditSearchPerson,
  PartnerLinkCredentials,
  PartnerLinkError,
} from '../types';
import * as moment from 'moment';

describe('CreditSearchPersonTransformer', () => {
  it('hould throw error, no address given', () => {
    function build() {
      return new CreditSearchPersonTransformer({}).item(
        {} as CreditSearchPerson,
      );
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No addresses given.');
  });

  it('should transform item', () => {
    const data = {
      clientReference: 'REF-001',
      title: 'Mr',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: moment('1980-10-05'),
      addresses: [
        {
          id: '58150008380',
          address1: '12',
          address2: 'High Street',
          postalCode: 'M1 6NG',
          town: 'Westbury',
        },
      ],
    } as CreditSearchPerson;

    expect(
      new CreditSearchPersonTransformer({
        creditSearchClient: 'console',
        creditSearchUsername: 'root',
        creditSearchPassword: '',
      } as PartnerLinkCredentials).item(data),
    ).toEqual(`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetLightSearchAccountDataWithCreditSearchID xmlns="http://searchlink.co.uk/">
      <ClientReference>REF-001</ClientReference>
      <Title>Mr</Title>
      <Forename>John</Forename>
      <Surname>Smith</Surname>
      <DateOfBirth>1980-10-05</DateOfBirth>
      <PTCAB1>58150008380</PTCAB1>
      <HouseNumber1>12</HouseNumber1>
      <PostCode1>M1 6NG</PostCode1>
      <Town1>Westbury</Town1>
      <StreetName1>High Street</StreetName1>
      <PTCAB2></PTCAB2>
      <HouseNumber2></HouseNumber2>
      <PostCode2></PostCode2>
      <Town2></Town2>
      <StreetName2></StreetName2>
      <PTCAB3></PTCAB3>
      <HouseNumber3></HouseNumber3>
      <PostCode3></PostCode3>
      <Town3></Town3>
      <StreetName3></StreetName3>
      <cred>
        <Client>console</Client>
        <UserName>root</UserName>
        <Password></Password>
      </cred>
    </GetLightSearchAccountDataWithCreditSearchID>
  </soap:Body>
</soap:Envelope>`);
  });

  it('should return an empty string', () => {
    expect(new CreditSearchPersonTransformer({}).items([])).toEqual('');
  });
});

describe('CreditSearchPersonResultTransformer', () => {
  return expect(
    new CreditSearchPersonResultTransformer({}).xmlItems(''),
  ).resolves.toEqual([]);
});
