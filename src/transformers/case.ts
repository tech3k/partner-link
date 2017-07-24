import { Transformer, XmlToObjectTransformer, ObjectToXmlTransformer } from "./transformer";
import { PartnerLinkError, Case, CaseResult } from "../types";

import { VehicleTransformer, PropertyTransformer, AssetTransformer, IncomeTransformer, ExpenditureTransformer } from "./";

export class CaseTransformer extends Transformer implements ObjectToXmlTransformer {
  public item(object: Case): string {
    // if (object.houseNumber === undefined || object.houseNumber === null || object.houseNumber.length === 0) {
    //   throw new PartnerLinkError('House Number is missing from the address.', 406);
    // }

    return `
<CreateFullCaseRequest>
   <CaseDetails>
      <CaseMainDetails>
         <AddressCountryID>1</AddressCountryID>
         <ContactMade>true</ContactMade>
         <FirstName>${object.people[0].firstName}</FirstName>
         <Gender>${object.people[0].gender}</Gender>
         <Joint>${object.people.length > 1 ? 'true' : 'false'}</Joint>
         <LeadProviderID>${this.credentials.leadProviderId}</LeadProviderID>
         ${object.people[0].maidenName === undefined || object.people[0].maidenName === null ? `` : `<MaidenName>${object.people[0].maidenName}</MaidenName>`}
         <PartnerUnaware>false</PartnerUnaware>
         <Salutation>${object.people[0].title}</Salutation>
         <SourceCode>${this.credentials.sourceCode}</SourceCode>
         <Surname>${object.people[0].lastName}</Surname>
      </CaseMainDetails>
      <EmploymentDetails>
         ${object.people[0].employerName === undefined || object.people[0].employerName === null ? `` : `<EmployerName>${object.people[0].employerName}</EmployerName>`}
         ${object.people[0].employmentStatus === undefined || object.people[0].employmentStatus === null ? `` : `<EmploymentStatus>${object.people[0].employmentStatus}</EmploymentStatus>`}
         ${object.people[0].jobTitle === undefined || object.people[0].jobTitle === null ? `` : `<JobTitle>${object.people[0].jobTitle}</JobTitle>`}
         ${object.people.length < 2 ? `` : `
           ${object.people[1].employerName === undefined || object.people[1].employerName === null ? `` : `<EmployerName>${object.people[1].employerName}</EmployerName>`}
           ${object.people[1].employmentStatus === undefined || object.people[1].employmentStatus === null ? `` : `<EmploymentStatus>${object.people[1].employmentStatus}</EmploymentStatus>`}
           ${object.people[1].jobTitle === undefined || object.people[1].jobTitle === null ? `` : `<JobTitle>${object.people[1].jobTitle}</JobTitle>`}
         `}
      </EmploymentDetails>
      ${(new ExpenditureTransformer).items(object.expenditure)}
      ${(new IncomeTransformer).items(object.income)}
      ${(new AssetTransformer).items(object.assets)}
      <PersonalDetails>
         <AddressLine1>${object.people[0].addresses[0].address1}</AddressLine1>
         ${object.people[0].addresses[0].address2 === undefined ? `` : `<AddressLine2>${object.people[0].addresses[0].address2}</AddressLine2>`}
         <City>${object.people[0].addresses[0].town}</City>
         <CountryID>1</CountryID>
         ${object.people[0].addresses[0].county === undefined ? `` : `<County>${object.people[0].addresses[0].county}</County>`}
         <DateOfBirth>${object.people[0].dateOfBirth.format("YYYY-MM-DD")}</DateOfBirth>
         ${object.dependants.length === 0 ? `` : `
           <DependantsList>
              ${object.dependants.map(item => `
                <Dependant>
                   <Age>${item.fromNow().split(" ")[0]}</Age>
                </Dependant>
              `).join("\n")}
           </DependantsList>
         `}
         ${object.people[0].emailAddress === undefined || object.people[0].emailAddress === null || object.people[0].emailAddress.length < 5 ? `` : `<Email>${object.people[0].emailAddress}</Email>`}
         <FirstName>${object.people[0].firstName}</FirstName>
         <Gender>${object.people[0].gender}</Gender>
         ${object.people[0].homeNumber === undefined || object.people[0].homeNumber === null ? `` : `<HomeTelephone>${object.people[0].homeNumber}</HomeTelephone>`}
         <JointApplicant>${object.people.length > 1 ? 'true' : 'false'}</JointApplicant>
         ${object.people[0].maidenName === undefined || object.people[0].maidenName === null ? `` : `<MaidenName>${object.people[0].maidenName}</MaidenName>`}
         <MaritalStatus>Single</MaritalStatus>
         ${object.people[0].middleNames === undefined || object.people[0].middleNames === null ? `` : `<MiddleName>${object.people[0].middleNames}</MiddleName>`}
         ${object.people[0].mobileNumber === undefined || object.people[0].mobileNumber === null ? `` : `<Mobile>${object.people[0].mobileNumber}</Mobile>`}
         ${object.people.length < 2 ? `` : `
           <PartnerAddressLine1>${object.people[1].addresses[0].address1}</PartnerAddressLine1>
           <PartnerAddressLine2>${object.people[1].addresses[0].address2}</PartnerAddressLine2>
           <PartnerCity>${object.people[1].addresses[0].town}</PartnerCity>
           <PartnerCountryID>1</PartnerCountryID>
           <PartnerCounty>${object.people[1].addresses[0].county}</PartnerCounty>
           <PartnerDateOfBirth>${object.people[1].dateOfBirth.format("YYYY-MM-DD")}</PartnerDateOfBirth>
           ${object.people[1].emailAddress === undefined || object.people[1].emailAddress === null || object.people[1].emailAddress.length < 5 ? `` : `<PartnerEmail>${object.people[1].emailAddress}</PartnerEmail>`}
           <PartnerFirstName>${object.people[1].firstName}</PartnerFirstName>
           <PartnerGender>${object.people[1].gender}</PartnerGender>
           ${object.people[1].homeNumber === undefined || object.people[1].homeNumber === null || object.people[1].homeNumber.length < 5 ? `` : `<PartnerHomeTelephone>${object.people[1].homeNumber}</PartnerHomeTelephone>`}
           ${object.people[1].maidenName === undefined || object.people[1].maidenName === null || object.people[1].maidenName.length < 5 ? `` : `<PartnerMaidenName>${object.people[1].maidenName}</PartnerMaidenName>`}
           <PartnerMaritalStatus>Single</PartnerMaritalStatus>
           ${object.people[1].middleNames === undefined || object.people[1].middleNames === null || object.people[1].middleNames.length < 5 ? `` : `<PartnerMiddleName>${object.people[1].middleNames}</PartnerMiddleName>`}
           <PartnerMobile>${object.people[1].mobileNumber}</PartnerMobile>
           <PartnerPostcode>${object.people[1].addresses[0].postalCode}</PartnerPostcode>
           ${object.people[1].title === undefined || object.people[1].title === null || object.people[1].title.length < 2 ? `` : `<PartnerSalutation>${object.people[1].title}</PartnerSalutation>`}
           <PartnerSurname>${object.people[1].lastName}</PartnerSurname>
         `}
         <PartnerUnaware>false</PartnerUnaware>
         <Postcode>${object.people[0].addresses[0].postalCode}</Postcode>
         <Salutation>${object.people[0].title}</Salutation>
         <Surname>${object.people[0].lastName}</Surname>
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
