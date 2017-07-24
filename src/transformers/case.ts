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
         <MaidenName>${object.people[0].maidenName}</MaidenName>
         <PartnerUnaware>false</PartnerUnaware>
         <Salutation>${object.people[0].title}</Salutation>
         <SourceCode>${this.credentials.sourceCode}</SourceCode>
         <Surname>${object.people[0].lastName}</Surname>
      </CaseMainDetails>
      <EmploymentDetails>
         <EmployerName>${object.people[0].employerName}</EmployerName>
         <EmploymentStatus>${object.people[0].employmentStatus}</EmploymentStatus>
         <JobTitle>${object.people[0].jobTitle}</JobTitle>
         <PartnerEmployerName>${object.people[1].employerName}</PartnerEmployerName>
         <PartnerEmploymentStatus>${object.people[1].employmentStatus}</PartnerEmploymentStatus>
         <PartnerJobTitle>${object.people[1].jobTitle}</PartnerJobTitle>
      </EmploymentDetails>
      ${(new ExpenditureTransformer).items(object.expenditure)}
      ${(new IncomeTransformer).items(object.income)}
      ${(new AssetTransformer).items(object.assets)}
      <PersonalDetails>
         <AddressLine1>${object.people[0].addresses[0].address1}</AddressLine1>
         <AddressLine2>${object.people[0].addresses[0].address2}</AddressLine2>
         <City>${object.people[0].addresses[0].town}</City>
         <CountryID>1</CountryID>
         <County>${object.people[0].addresses[0].county}</County>
         <DateOfBirth>${object.people[0].dateOfBirth.format("YYYY-MM-DD")}</DateOfBirth>
         <DependantsList>
            ${object.dependants.map(item => `
              <Dependant>
                 <Age>${item.fromNow().split(" ")[0]}</Age>
              </Dependant>
            `)}
         </DependantsList>
         <Email>${object.people[0].emailAddress}</Email>
         <FirstName>${object.people[0].firstName}</FirstName>
         <Gender>${object.people[0].gender}</Gender>
         <HomeTelephone>${object.people[0].homeNumber}</HomeTelephone>
         <JointApplicant>${object.people.length > 1 ? 'true' : 'false'}</JointApplicant>
         <MaidenName>${object.people[0].maidenName}</MaidenName>
         <MaritalStatus>Married</MaritalStatus>
         <MiddleName>${object.people[0].middleNames}</MiddleName>
         <Mobile>${object.people[0].mobileNumber}</Mobile>
         <PartnerAddressLine1>${object.people[1].addresses[0].address1}</PartnerAddressLine1>
         <PartnerAddressLine2>${object.people[1].addresses[0].address2}</PartnerAddressLine2>
         <PartnerCity>${object.people[1].addresses[0].town}</PartnerCity>
         <PartnerCountryID>1</PartnerCountryID>
         <PartnerCounty>${object.people[1].addresses[0].county}</PartnerCounty>
         <PartnerDateOfBirth>${object.people[1].dateOfBirth.format("YYYY-MM-DD")}</PartnerDateOfBirth>
         <PartnerEmail>${object.people[1].emailAddress}</PartnerEmail>
         <PartnerFirstName>${object.people[1].firstName}</PartnerFirstName>
         <PartnerGender>${object.people[1].gender}</PartnerGender>
         <PartnerHomeTelephone>${object.people[1].homeNumber}</PartnerHomeTelephone>
         <PartnerMaidenName>${object.people[1].maidenName}</PartnerMaidenName>
         <PartnerMaritalStatus>Married</PartnerMaritalStatus>
         <PartnerMiddleName>${object.people[1].middleNames}</PartnerMiddleName>
         <PartnerMobile>${object.people[1].mobileNumber}</PartnerMobile>
         <PartnerPostcode>${object.people[1].addresses[0].postalCode}</PartnerPostcode>
         <PartnerSalutation>${object.people[1].title}</PartnerSalutation>
         <PartnerSurname>${object.people[1].lastName}</PartnerSurname>
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
