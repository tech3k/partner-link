import { Property } from '../types';
import { ObjectToXmlTransformer } from './transformer';

export class PropertyTransformer implements ObjectToXmlTransformer {
  public item(object: Property) {
    return {
      AccountNo: object.accountNo,
      AddressLine1: object.address1,
      AddressLine2: object.address2,
      AmountOfEquity: object.amountOfEquity / 100,
      Applicant: object.applicant,
      City: object.city,
      Country: object.country,
      County: object.county,
      DebtorShare: object.debtorShare,
      HomeAddress: object.homeAddress ? 'true' : 'false',
      IncludeEquity: object.includeEquity ? 'true' : 'false',
      LastRemortgaged: object.lastRemortgaged.format('YYYY-MM-DD'),
      MonthsInProperty: object.monthsInProperty,
      MortgageOutstanding: object.mortgageOutstanding,
      Owner: object.owner,
      Ownership: object.ownership,
      Postcode: object.postalCode,
      PreviousAddress: object.previousAddress ? 'true' : 'false',
      PrimaryLender: object.primaryLender,
      PropertyInNameOf: object.propertyInNameOf,
      PropertyType: object.propertyType,
      PropertyValue: object.propertyValue / 100,
      SecuredLoan: object.securedLoan,
      ThirdPartyOwner: object.thirdPartyOwner,
      TitleNumber: object.titleNumber,
      YearsInProperty: object.yearsInProperty,
      YearsRemaining: object.yearsRemaining,
    };
  }

  public items(object: Property[]) {
    if (!object || !object.length) {
      return {};
    }

    return {
      Properties: { PropertyRequest: object.map(item => this.item(item)) },
    };
  }
}
