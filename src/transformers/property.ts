import { XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { Property } from "../types";

export class PropertyTransformer implements ObjectToXmlTransformer {

  item(object: Property): string {
    return `
<PropertyRequest>
   <AccountNo>${object.accountNo}</AccountNo>
   <AddressLine1>${object.address1}</AddressLine1>
   <AddressLine2>${object.address2}</AddressLine2>
   <AmountOfEquity>${object.amountOfEquity / 100}</AmountOfEquity>
   <Applicant>${object.applicant}</Applicant>
   <City>${object.city}</City>
   <Country>${object.country}</Country>
   <County>${object.county}</County>
   <DebtorShare>${object.debtorShare}</DebtorShare>
   <HomeAddress>${object.homeAddress ? 'true' : 'false'}</HomeAddress>
   <IncludeEquity>${object.includeEquity ? 'true' : 'false'}</IncludeEquity>
   <LastRemortgaged>${object.lastRemortgaged.format('YYYY-MM-DD')}</LastRemortgaged>
   <MonthsInProperty>${object.monthsInProperty}</MonthsInProperty>
   <MortgageOutstanding>${object.mortgageOutstanding}</MortgageOutstanding>
   <Owner>${object.owner}</Owner>
   <Ownership>${object.ownership}</Ownership>
   <Postcode>${object.postalCode}</Postcode>
   <PreviousAddress>${object.previousAddress ? 'true' : 'false'}</PreviousAddress>
   <PrimaryLender>${object.primaryLender}</PrimaryLender>
   <PropertyInNameOf>${object.propertyInNameOf}</PropertyInNameOf>
   <PropertyType>${object.propertyType}</PropertyType>
   <PropertyValue>${object.propertyValue / 100}</PropertyValue>
   <SecuredLoan>${object.securedLoan}</SecuredLoan>
   <ThirdPartyOwner>${object.thirdPartyOwner}</ThirdPartyOwner>
   <TitleNumber>${object.titleNumber}</TitleNumber>
   <YearsInProperty>${object.yearsInProperty}</YearsInProperty>
   <YearsRemaining>${object.yearsRemaining}</YearsRemaining>
</PropertyRequest>
    `;
  }

  items(object: Property[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<Properties>
  ${object.map(item => this.item(item)).join("\n")}
</Properties>
    `;
  }

}
