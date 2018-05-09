import {CreditSearch} from './credit-search';
import {CreditSearchAddress, PartnerLinkCredentials, PartnerLinkError} from '../types';

describe('Service: Credit Search', () => {
    it('should throw error if credentials omitted', () => {
        function build() {
            new CreditSearch(undefined);
        }

        expect(build).toThrow('No credentials given.');
        expect(build).toThrow(PartnerLinkError);
    });

//     it('should return credit search adress results', () => {
//
//         const cred = {debug: true} as PartnerLinkCredentials;
//         const service = new CreditSearch(cred);
//         jest.spyOn(service, 'soapRequest')
//             .mockImplementation(async () => {
//                 return await `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
// <soap:Envelope>
//     <soap:Body>
//         <SearchAddressResponse>
//             <SearchAddressResult>
//                 <Address>
//                     <AddressMatch>
//                         <ptcabs>101010</ptcabs>
//                         <HouseNumber>12</HouseNumber>
//                         <Street1>High St</Street1>
//                         <Street2></Street2>
//                         <Town>Westbury</Town>
//                         <PostCode>M1 6NG</PostCode>
//                     </AddressMatch>
//                 </Address>
//             </SearchAddressResult>
//         </SearchAddressResponse>
//     </soap:Body>
// </soap:Envelope>`;
//             });
//
//         const data = {
//             houseNumber: '12',
//             postalCode: 'M1 6NG',
//             street: 'High St',
//             town: 'Westbury',
//             surname: 'Smith',
//         } as CreditSearchAddress;
//
//         expect(service.checkAddress(data)).resolves.toEqual({});
//     });
});
