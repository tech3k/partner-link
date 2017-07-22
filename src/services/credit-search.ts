import { Service } from "./service";
import { CreditSearchAddressResultTransformer, CreditSearchAddressTransformer } from "../transformers";
import { CreditSearchAddress, CreditSearchAddressResult, PartnerLinkError, CreditSearchPerson, CreditSearchPersonResult } from "../types";

export class CreditSearch extends Service {

  /**
   * Checks with the credit search system to ensure a valid address and return
   * the correct formatting for the address.
   *
   * @param  {CreditSearchAddress} address The required address
   * @return {CreditSearchResult}          The parsed valid address
   */
  public checkAddress(address: CreditSearchAddress): Promise<CreditSearchAddressResult> {
    return Promise.resolve(address)
      .then(address => this.soapRequest(
        (new CreditSearchAddressTransformer(this.credentials)).item(address),
        "creditSearchUrl",
        "services/SearchHeavyInterface.asmx",
        "http://searchlink.co.uk/SearchAddress"
      ))
      .then(addressResult => (new CreditSearchAddressResultTransformer(this.credentials)).xmlItem(addressResult))
      .then(addressResult => {
        if (addressResult.id === undefined || addressResult.id === null || addressResult.id.length === 0) {
          throw new PartnerLinkError(`Address ${address.houseNumber} ${address.postalCode} was not found.`, 406);
        }

        return addressResult;
      })
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `Address ${address.houseNumber} ${address.postalCode} was not found.` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

  /**
   * Checks up to three addresses at once and returns the appropriately
   * formatted address.
   *
   * @param  {CreditSearchAddress[]}          addresses An array of addresses
   * @return {Promise<CreditSearchResult[]>}            An array of parsed addresses
   */
  public checkMultipleAddresses(addresses: CreditSearchAddress[]): Promise<CreditSearchAddressResult[]> {
    return Promise.resolve(addresses)
      .then(addresses => {
        if (addresses.length > 3) { throw new PartnerLinkError("No more than 3 addresses can be credit searched.", 406) }

        return addresses;
      })
      .then(addresses => Promise.all(addresses.map(address => this.checkAddress(address))))
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `At least one requested address was not found.` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

  public performCreditCheck(person: CreditSearchPerson): Promise<CreditSearchPersonResult> {
    return Promise.resolve(person)
      .then(person => new CreditSearchPersonResult)
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `At least one requested address was not found.` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

}
