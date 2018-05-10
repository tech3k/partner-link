import {Service} from './service';
import {
    CreditReportTransformer,
    CreditSearchAddressResultTransformer,
    CreditSearchAddressTransformer,
    CreditSearchPersonResultTransformer,
    CreditSearchPersonTransformer,
} from '../transformers';
import {
    CreditSearchAddress,
    CreditSearchAddressResult,
    CreditSearchPerson,
    CreditSearchPersonResult,
    PartnerLinkError,
} from '../types';

export class CreditSearch extends Service {
    /**
     * Checks with the credit search system to ensure a valid address and return
     * the correct formatting for the address.
     *
     * @param  { CreditSearchAddress } address The required address
     * @return { CreditSearchResult }          The parsed valid address
     */
    public checkAddress(address: CreditSearchAddress): Promise<CreditSearchAddressResult[]> {
        return Promise.resolve(address)
            .then((raw) => this.soapRequest(
                new CreditSearchAddressTransformer(this.credentials).item(raw),
                'creditSearchUrl',
                'services/SearchHeavyInterface.asmx',
                'http://searchlink.co.uk/SearchAddress',
            ))
            .then(async (addressResult) => {
                return new CreditSearchAddressResultTransformer(this.credentials).xmlItems(addressResult);
            })
            .then(addressResult => {
                if (addressResult.length === 0) {
                    throw new PartnerLinkError(`Address ${address.houseNumber}, ${address.postalCode} was not found.`, 406);
                }

                return addressResult;
            })
            .catch(e => {
                this.log('checkAddress', e);
                throw new PartnerLinkError(
                    !e.message ? `Unable to search for address.` : e.message,
                    !e.code ? 500 : e.code,
                );
            });
    }

    /**
     * Checks up to three addresses at once and returns the appropriately
     * formatted address.
     *
     * @param  {CreditSearchAddress[]}          addresses An array of addresses
     * @return {Promise<CreditSearchResult[]>}            An array of parsed addresses
     */
    public checkMultipleAddresses(addresses: CreditSearchAddress[]): Promise<CreditSearchAddressResult[][]> {
        return Promise.resolve(addresses)
            .then((addresses) => {
                if (addresses.length > 3) {
                    throw new PartnerLinkError(
                        'No more than 3 addresses can be credit searched.',
                        406,
                    );
                }
                return addresses;
            })
            .then((addresses) => Promise.all(addresses.map(address => this.checkAddress(address))))
            .catch(e => {
                this.log('checkMultipleAddresses', e);
                throw new PartnerLinkError(
                    !e.code ? `At least one requested address was not found.` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    /**
     * Performs a credit check on a person at the supplied addresses
     *
     * @param  {CreditSearchPerson}                person Details of the person
     * @return {Promise<CreditSearchPersonResult>}        ID of the credit search, creditor list and credit report
     */
    public performCreditCheck(person: CreditSearchPerson): Promise<CreditSearchPersonResult> {
        return Promise.resolve(person)
            .then((raw) => new CreditSearchPersonTransformer(this.credentials).item(raw))
            .then(personTransformed => this.soapRequest(
                personTransformed,
                'creditSearchUrl',
                'services/SearchHeavyInterface.asmx',
                'http://searchlink.co.uk/GetLightSearchAccountDataWithCreditSearchID',
            ))
            .then(personResult => new CreditSearchPersonResultTransformer(this.credentials).xmlItem(personResult))
            .then(transformedPerson => {
                return Promise.resolve(transformedPerson.id)
                    .then(id => this.getCreditReport(id))
                    .then(html => {
                        transformedPerson.report = html;
                        return transformedPerson;
                    });
            })
            .catch(e => {
                this.log('performCreditCheck', e);
                throw new PartnerLinkError(
                    !e.code ? 'Unable to preform credit search.' : e.message,
                    !e.code ? 500 : e.code,
                );
            });
    }

    public getCreditReport(id: number): Promise<string> {
        return Promise.resolve(id)
            .then((value) => this.soapRequest(
                new CreditReportTransformer(this.credentials).item(value),
                'creditSearchUrl',
                'services/SearchHeavyInterface.asmx',
                'http://searchlink.co.uk/GetLightSearchCreditReportHTML',
            ))
            .then(result => new CreditReportTransformer(this.credentials).getHtmlFromResult(result));
    }
}
