import * as moment from "moment";

import { AssetTransformer, ExpenditureTransformer, IncomeTransformer, PropertyTransformer, VehicleTransformer } from "./";
import { Case, CaseResult, PartnerLinkError } from "../types";
import { ObjectToXmlTransformer, Transformer, XmlToObjectTransformer } from "./transformer";



export class CaseTransformer extends Transformer implements ObjectToXmlTransformer {
  public item(object: Case): string {
    if (object.people[0].employmentStatus === undefined || object.people[0].employmentStatus === null || object.people[0].employmentStatus.length === 0) {
      throw new PartnerLinkError('No Employment Status has been provided.', 406);
    }

    if (object.people[0].homeNumber === undefined || object.people[0].homeNumber === null || object.people[0].homeNumber.length === 0) {
      throw new PartnerLinkError('No home telephone number has been provided.', 406);
    }

    let clientAddressMatches = object.people[0].addresses[0].address1.trim().match(/((?:[F|f][l|L][a|A][t|T] )?[1-9]\d+[A-Za-z]?)[\s+|\S+]?([A-Za-z0-9 ]+)?/);
    let clientHouseNumber = clientAddressMatches[1].trim();
    let clientStreetName = clientAddressMatches[2] !== undefined ? clientAddressMatches[2].trim() : object.people[0].addresses[0].address2;
    let partnerHouseNumber: string = undefined;
    let partnerStreetName: string = undefined;

    if (object.people.length > 1) {
      let partnerAddressMatches = object.people[1].addresses[0].address1.trim().match(/((?:[F|f][l|L][a|A][t|T] )?[1-9]\d+[A-Za-z]?)[\s+|\S+]?([A-Za-z0-9 ]+)?/);
      partnerHouseNumber = partnerAddressMatches[1].trim();
      partnerStreetName = partnerAddressMatches[2] !== undefined ? partnerAddressMatches[2].trim() : object.people[1].addresses[0].address2;
    }


    return `
<CreateFullCaseRequest>
   <CaseDetails>
      <CaseMainDetails>
         <AddressCountryID>1</AddressCountryID>
         <ContactMade>true</ContactMade>
         <FirstName>${object.people[0].firstName.trim()}</FirstName>
         <Gender>${object.people[0].gender.trim()}</Gender>
         <Joint>${object.people.length > 1 ? 'true' : 'false'}</Joint>
         <LeadProviderID>${this.credentials.leadProviderId}</LeadProviderID>
         ${object.people[0].maidenName === undefined || object.people[0].maidenName === null ? `` : `<MaidenName>${object.people[0].maidenName.trim()}</MaidenName>`}
         <PartnerUnaware>false</PartnerUnaware>
         ${object.people[0].title === undefined || object.people[0].title === null ? `` : `<Salutation>${object.people[0].title.trim()}</Salutation>`}
         <SourceCode>${this.credentials.sourceCode}</SourceCode>
         <Surname>${object.people[0].lastName.trim()}</Surname>
      </CaseMainDetails>
      <EmploymentDetails>
         ${object.people[0].employerName === undefined || object.people[0].employerName === null ? `` : `<EmployerName>${object.people[0].employerName.trim()}</EmployerName>`}
         ${object.people[0].employmentStatus === undefined || object.people[0].employmentStatus === null ? `` : `<EmploymentStatus>${object.people[0].employmentStatus.trim()}</EmploymentStatus>`}
         ${object.people[0].jobTitle === undefined || object.people[0].jobTitle === null ? `` : `<JobTitle>${object.people[0].jobTitle.trim()}</JobTitle>`}
         ${object.people.length < 2 ? `` : `
           ${object.people[1].employerName === undefined || object.people[1].employerName === null ? `` : `<EmployerName>${object.people[1].employerName.trim()}</EmployerName>`}
           ${object.people[1].employmentStatus === undefined || object.people[1].employmentStatus === null ? `` : `<EmploymentStatus>${object.people[1].employmentStatus.trim()}</EmploymentStatus>`}
           ${object.people[1].jobTitle === undefined || object.people[1].jobTitle === null ? `` : `<JobTitle>${object.people[1].jobTitle.trim()}</JobTitle>`}
         `}
      </EmploymentDetails>
      ${(new ExpenditureTransformer).items(object.expenditure)}
      ${(new IncomeTransformer).items(object.income)}
      ${(new AssetTransformer).items(object.assets)}
      <PersonalDetails>
         <AddressLine1>${clientHouseNumber}</AddressLine1>
         <AddressLine2>${clientStreetName}</AddressLine2>
         <City>${object.people[0].addresses[0].town.trim()}</City>
         <CountryID>1</CountryID>
         ${object.people[0].addresses[0].county === undefined ? `` : `<County>${object.people[0].addresses[0].county.trim()}</County>`}
         <DateOfBirth>${object.people[0].dateOfBirth.format("YYYY-MM-DD")}</DateOfBirth>
         ${object.dependants.length === 0 ? `` : `
           <DependantsList>
              ${object.dependants.map(item => `
                <Dependant>
                   <Age>${item.diff(moment().format("YYYY-MM-DD"), "years") * -1}</Age>
                </Dependant>
              `).join("\n")}
           </DependantsList>
         `}
         ${object.people[0].emailAddress === undefined || object.people[0].emailAddress === null || object.people[0].emailAddress.length < 5 ? `` : `<Email>${object.people[0].emailAddress.trim()}</Email>`}
         <FirstName>${object.people[0].firstName.trim()}</FirstName>
         ${object.people[0].gender === undefined || object.people[0].gender === null || object.people[0].gender.length < 1 ? `` : `<Gender>${object.people[0].gender.trim()}</Gender>`}
         ${object.people[0].homeNumber === undefined || object.people[0].homeNumber === null ? `` : `<HomeTelephone>${object.people[0].homeNumber.trim()}</HomeTelephone>`}
         <JointApplicant>${object.people.length > 1 ? 'true' : 'false'}</JointApplicant>
         ${object.people[0].maidenName === undefined || object.people[0].maidenName === null ? `` : `<MaidenName>${object.people[0].maidenName.trim()}</MaidenName>`}
         ${object.people[0].maritalStatus === undefined || object.people[0].maritalStatus === null ? `` : `<MaritalStatus>${object.people[0].maritalStatus}</MaritalStatus>`}
         ${object.people[0].middleNames === undefined || object.people[0].middleNames === null ? `` : `<MiddleName>${object.people[0].middleNames.trim()}</MiddleName>`}
         ${object.people[0].mobileNumber === undefined || object.people[0].mobileNumber === null ? `` : `<Mobile>${object.people[0].mobileNumber.trim()}</Mobile>`}
         ${object.people.length < 2 ? `` : `
           ${partnerHouseNumber === undefined ? `` : `<PartnerAddressLine1>${partnerHouseNumber}</PartnerAddressLine1>`}
           ${partnerStreetName === undefined ? `` : `<PartnerAddressLine2>${partnerStreetName}</PartnerAddressLine2>`}
           ${object.people[1].addresses[0].town === undefined || object.people[1].addresses[0].town === null ? `` : `<PartnerCity>${object.people[1].addresses[0].town.trim()}</PartnerCity>`}
           <PartnerCountryID>1</PartnerCountryID>
           ${object.people[1].addresses[0].county === undefined || object.people[1].addresses[0].county === null ? `` : `<PartnerCounty>${object.people[1].addresses[0].county.trim()}</PartnerCounty>`}
           <PartnerDateOfBirth>${object.people[1].dateOfBirth.format("YYYY-MM-DD")}</PartnerDateOfBirth>
           ${object.people[1].emailAddress === undefined || object.people[1].emailAddress === null || object.people[1].emailAddress.length < 5 ? `` : `<PartnerEmail>${object.people[1].emailAddress.trim()}</PartnerEmail>`}
           <PartnerFirstName>${object.people[1].firstName.trim()}</PartnerFirstName>
           ${object.people[1].gender === undefined || object.people[1].gender === null || object.people[1].gender.length < 1 ? `` : `<PartnerGender>${object.people[0].gender.trim()}</PartnerGender>`}
           ${object.people[1].homeNumber === undefined || object.people[1].homeNumber === null || object.people[1].homeNumber.length < 5 ? `` : `<PartnerHomeTelephone>${object.people[1].homeNumber.trim()}</PartnerHomeTelephone>`}
           ${object.people[1].maidenName === undefined || object.people[1].maidenName === null || object.people[1].maidenName.length < 5 ? `` : `<PartnerMaidenName>${object.people[1].maidenName.trim()}</PartnerMaidenName>`}
           ${object.people[1].maritalStatus === undefined || object.people[1].maritalStatus === null ? `` : `<PartnerMaritalStatus>${object.people[1].maritalStatus}</PartnerMaritalStatus>`}
           ${object.people[1].middleNames === undefined || object.people[1].middleNames === null || object.people[1].middleNames.length < 5 ? `` : `<PartnerMiddleName>${object.people[1].middleNames.trim()}</PartnerMiddleName>`}
           <PartnerMobile>${object.people[1].mobileNumber.trim()}</PartnerMobile>
           <PartnerPostcode>${object.people[1].addresses[0].postalCode.trim()}</PartnerPostcode>
           ${object.people[1].title === undefined || object.people[1].title === null || object.people[1].title.length < 2 ? `` : `<PartnerSalutation>${object.people[1].title.trim()}</PartnerSalutation>`}
           <PartnerSurname>${object.people[1].lastName}</PartnerSurname>
         `}
         <PartnerUnaware>false</PartnerUnaware>
         <Postcode>${object.people[0].addresses[0].postalCode.trim()}</Postcode>
         ${object.people[0].title === undefined || object.people[0].title === null ? `` : `<Salutation>${object.people[0].title.trim()}</Salutation>`}
         <Surname>${object.people[0].lastName.trim()}</Surname>
      </PersonalDetails>
      ${(new PropertyTransformer).items(object.properties)}
      ${(new VehicleTransformer).items(object.vehicles)}
   </CaseDetails>
   <Password>${this.credentials.password}</Password>
   <Username>${this.credentials.username}</Username>
</CreateFullCaseRequest>
    `;
  }

  items(object: any[]): string {
    return '';
  }
}

export class CaseResultTransformer extends Transformer implements XmlToObjectTransformer {
  public xmlItem(xml: string): Promise<CaseResult> {
    return Promise.resolve(xml)
      .then(xml => this.parseXml(xml))
      .then(parsedXml => {
        if (parsedXml["CreatedAssignment"] === undefined) { throw new PartnerLinkError('Case could not be created', 406); }

        return parsedXml["CreatedAssignment"]
      })
      .then(parsedSingleResult => {
        let caseResult: CaseResult = new CaseResult;

        console.log(parsedSingleResult);

        caseResult.id = parsedSingleResult.AssignmentID[0];
        caseResult.reference = parsedSingleResult.CaseReference[0];

        return caseResult;
      })
  }

  public xmlItems(xml: string): Promise<CaseResult[]> {
    // Not necessary for this transformer
    return undefined;
  }
}
