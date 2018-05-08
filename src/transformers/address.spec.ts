import {AddAddressTransformer, CreditSearchAddressTransformer} from './address';
import {CreditSearchAddress, CreditSearchAddressResult, PartnerLinkCredentials, PartnerLinkError} from '../types';

describe('CreditSearchAddressTransformer', () => {
    it('should throw error house number is required', () => {

        function build() {
            return new CreditSearchAddressTransformer({}).item({} as CreditSearchAddress);
        }

        expect(build).toThrowError(PartnerLinkError);
        expect(build).toThrowError('House Number is missing from the address.');
    });

    it('should throw error street is required', () => {
        function build() {
            return new CreditSearchAddressTransformer({}).item({
                houseNumber: '12',
            } as CreditSearchAddress);
        }

        expect(build).toThrowError(PartnerLinkError);
        expect(build).toThrowError('Street is missing from the address.');
    });

    it('should throw error postal code is required', () => {
        function build() {
            return new CreditSearchAddressTransformer({}).item({
                houseNumber: '12',
                street: 'High St',
            } as CreditSearchAddress);
        }

        expect(build).toThrowError(PartnerLinkError);
        expect(build).toThrowError('Postcode is missing from the address');
    });

    it('should throw error town is required', () => {
        function build() {
            return new CreditSearchAddressTransformer({}).item({
                houseNumber: '12',
                street: 'High St',
                postalCode: 'M1 6NG',
            } as CreditSearchAddress);
        }

        expect(build).toThrowError(PartnerLinkError);
        expect(build).toThrowError('Town is missing from the address.');
    });

    it('should throw error surname is required', () => {
        function build() {
            return new CreditSearchAddressTransformer({}).item({
                houseNumber: '12',
                street: 'High St',
                postalCode: 'M1 6NG',
                town: 'Westbury',
            } as CreditSearchAddress);
        }

        expect(build).toThrowError(PartnerLinkError);
        expect(build).toThrowError('Surname is missing from the address.');
    });

    it('should transform a single item', () => {
        const data = {
            houseNumber: '12',
            street: 'High St',
            town: 'Westbury',
            county: 'Lancashire',
            postalCode: 'M1 6NG',
            surname: 'Smith',
        } as CreditSearchAddress;

        expect(new CreditSearchAddressTransformer({
            creditSearchUsername: 'root',
            creditSearchPassword: '',
            creditSearchClient: 'console',
        } as PartnerLinkCredentials).item(data))
            .toEqual(`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <SearchAddress xmlns="http://searchlink.co.uk/">
    <HouseNumber>12</HouseNumber>
    <PostCode>M1 6NG</PostCode>
    <Street>High St</Street>
    <Town>Westbury</Town>
    <Surname>Smith</Surname>
    <cred>
      <Client>console</Client>
      <UserName>root</UserName>
      <Password></Password>
    </cred>
  </SearchAddress>
</soap:Body>
</soap:Envelope>`);
    });

    it('should return empty string', () => {
        expect(new CreditSearchAddressTransformer({}).items([])).toBe('');
    })
});

describe('AddAddressTransformer', () => {

    it('should throw an exception on instantiate new instance', () => {
        expect(() => {
            return new AddAddressTransformer(undefined);
        }).toThrowError(PartnerLinkError);
    });

    it('should throw exception when one county is pass', () => {
        expect(() => {
            return new AddAddressTransformer({}).item({} as CreditSearchAddressResult, 0);
        }).toThrowError(PartnerLinkError);

        expect(() => {
            return new AddAddressTransformer({}).item({} as CreditSearchAddressResult, 0);
        }).toThrowError('County is missing from the address.');
    });

    it('should transform a single item', () => {
        const data = {
            id: '58150008380',
            address1: '12',
            address2: 'High St',
            town: 'Westbury',
            county: 'Lancashire',
            postalCode: 'M1 6NG',
            surname: 'Smith',
        } as CreditSearchAddressResult;

        expect(new AddAddressTransformer({}).item(data, 0)).toEqual({
            AddressLine1: '12',
            AddressLine2: 'High St',
            Applicant: 1,
            Country: 'England',
            County: 'Lancashire',
            Notes: 'Credit Check first address',
            Owner: 'Single',
            PTCAB: '58150008380',
            PostCode: 'M1 6NG',
            SearchNumber: 1,
        });
    });

    it('should transform multiple items', () => {
        const data: CreditSearchAddressResult[] = [
            {
                id: '58150008380',
                address1: '12',
                address2: 'High St',
                town: 'Westbury',
                county: 'Lancashire',
                postalCode: 'M1 6NG',
                surname: 'Smith',
            } as CreditSearchAddressResult,
            {
                id: '58150008380',
                address1: '12',
                address2: 'High St',
                town: 'Westbury',
                county: 'Lancashire',
                postalCode: 'M1 6NG',
                surname: 'Smith',
            } as CreditSearchAddressResult,
            {
                id: '58150008380',
                address1: '12',
                address2: 'High St',
                town: 'Westbury',
                county: 'Lancashire',
                postalCode: 'M1 6NG',
                surname: 'Smith',
            } as CreditSearchAddressResult,
        ];

        expect(new AddAddressTransformer({
            username: 'root',
            password: '',
        } as PartnerLinkCredentials).items(data)).toEqual({
            AddAddressesRequest: {
                Addresses: {
                    AddressDetails: [
                        {
                            AddressLine1: '12',
                            AddressLine2: 'High St',
                            Applicant: 1,
                            Country: 'England',
                            County: 'Lancashire',
                            Notes: 'Credit Check first address',
                            Owner: 'Single',
                            PTCAB: '58150008380',
                            PostCode: 'M1 6NG',
                            SearchNumber: 1,
                        },
                        {
                            AddressLine1: '12',
                            AddressLine2: 'High St',
                            Applicant: 1,
                            Country: 'England',
                            County: 'Lancashire',
                            Notes: 'Credit Check second address',
                            Owner: 'Single',
                            PTCAB: '58150008380',
                            PostCode: 'M1 6NG',
                            SearchNumber: 1,
                        },
                        {
                            AddressLine1: '12',
                            AddressLine2: 'High St',
                            Applicant: 1,
                            Country: 'England',
                            County: 'Lancashire',
                            Notes: 'Credit Check third address',
                            Owner: 'Single',
                            PTCAB: '58150008380',
                            PostCode: 'M1 6NG',
                            SearchNumber: 1,
                        },
                    ],
                },
                Password: '',
                Username: 'root',
            },
        });
    });
});