import * as moment from 'moment';
import {Case, CaseResult, PartnerLinkError} from '../types';
import {AssetTransformer, ExpenditureTransformer, IncomeTransformer} from './';
import { ObjectToXmlTransformer, Transformer, XmlToObjectTransformer } from './transformer';
import { VehicleTransformer } from './vehicle';
import { PropertyTransformer } from './property';

export class CaseTransformer extends Transformer
    implements ObjectToXmlTransformer {
    public item(object: Case) {
        if (!object.people[0] || !object.people[0].employmentStatus) {
            throw new PartnerLinkError('No Employment Status has been provided.', 406);
        }

        if (
            (!object.people[0] || (!object.people[0].homeNumber || object.people[0].homeNumber.length <= 3)) &&
            (!object.people[0] || (!object.people[0].mobileNumber || object.people[0].mobileNumber.length <= 3))
        ) {
            throw new PartnerLinkError('No home telephone number has been provided.', 406);
        }

        // const regex = /((?:Flat\s+)?\d+[A-Z]?).+?([A-Z0-9 ]+)?/i;
        const regex = /((?:[F|f][l|L][a|A][t|T] )?[1-9]\d*[A-Za-z]?)[\s+|\S+]?([A-Za-z0-9 ]+)?/;
        let clientHouseNumber: string;
        let clientStreetName: string;
        let partnerHouseNumber: string | null = null;
        let partnerStreetName: string | null = null;

        const addressSplitMatches = object.people[0].addresses[0].address1.trim().match(regex);
        clientHouseNumber = addressSplitMatches && addressSplitMatches[1] ? addressSplitMatches[1] : object.people[0].addresses[0].address1;
        clientStreetName = addressSplitMatches && addressSplitMatches[2] ? addressSplitMatches[2] : object.people[0].addresses[0].address2;

        if (object.people.length > 1) {
            const partnerAddressSplitMatches = object.people[1].addresses[0].address1.trim().match(regex);
            partnerHouseNumber = partnerAddressSplitMatches && partnerAddressSplitMatches[1] ? partnerAddressSplitMatches[1] : object.people[1].addresses[0].address1;
            partnerStreetName = partnerAddressSplitMatches && partnerAddressSplitMatches[2] ? partnerAddressSplitMatches[2] : object.people[1].addresses[0].address2;
        }

        const fullCase = {
            CreateFullCaseRequest: {
                CaseDetails: {
                    CaseMainDetails: {
                        AddressCountryID: 1,
                        ContactMade: true,
                        FirstName: object.people[0].firstName, // required
                        Gender: object.people[0].gender,       // required
                        Joint: object.people.length > 1, // boolean
                        LeadProviderID: this.credentials.leadProviderId,
                        MaidenName: object.people[0].maidenName,
                        PartnerUnaware: null, // boolean,
                        Salutation: object.people[0].title,
                        SourceCode: this.credentials.sourceCode,
                        Surname: object.people[0].lastName,
                    },
                    EmploymentDetails: {
                        EmployerName: object.people[0].employerName ? object.people[0].employerName : null,
                        EmploymentStatus: object.people[0].employmentStatus, // Required
                        JobTitle: object.people[0].jobTitle ? object.people[0].jobTitle : null,
                    },
                    Expenditure: {
                        ExpenditureFields: {
                            ExpenditureField: (object.expenditure || []).map(item => new ExpenditureTransformer().item(item)),
                        },
                    },
                    Income: {
                        IncomeFields: {
                            IncomeField: (object.income || []).map(item => new IncomeTransformer().item(item)),
                        },
                    },
                    OtherAssets: {
                        OtherAssetRequest: (object.assets || []).map(item => new AssetTransformer().item(item)),
                    },
                    PersonalDetails: {
                        AddressLine1: clientHouseNumber,
                        AddressLine2: clientStreetName,
                        City: object.people[0].addresses[0].town,
                        CountryID: 1,
                        County: object.people[0].addresses[0].county,
                        DateOfBirth: object.people[0].dateOfBirth.format('YYYY-MM-DD'),
                        DependantsList: {
                            Dependant: (object.dependants || []).map(item => {
                                return {
                                    Age: item.diff(moment().format('YYYY-MM-DD'), 'years') * -1,
                                };
                            }),
                        },
                        Email: object.people[0].emailAddress,
                        FirstName: object.people[0].firstName,
                        Gender: object.people[0].gender,
                        HomeTelephone: object.people[0].homeNumber.length > 2 ? object.people[0].homeNumber : object.people[0].mobileNumber,
                        JointApplicant: object.people.length > 1, // boolean,
                        MaidenName: object.people[0].maidenName,
                        MaritalStatus: object.people[0].maritalStatus,
                        MiddleName: object.people[0].middleNames,
                        Mobile: object.people[0].mobileNumber,
                        PartnerAddressLine1: partnerHouseNumber,
                        PartnerAddressLine2: partnerStreetName,
                        PartnerCity: object.people[1] ? object.people[1].addresses[0].town : null,
                        PartnerCountryID: object.people.length > 1 ? 1 : null,
                        PartnerCounty: object.people[1] ? object.people[1].addresses[0].county : null,
                        PartnerDateOfBirth: object.people[1] ? object.people[1].dateOfBirth.format('YYYY-MM-DD') : null,
                        PartnerEmail: object.people[1] ? object.people[1].emailAddress : null,
                        PartnerFirstName: object.people[1] ? object.people[1].firstName : null,
                        PartnerGender: object.people[1] ? object.people[1].gender : null,
                        PartnerHomeTelephone: object.people[1] ? object.people[1].homeNumber : null,
                        PartnerMaidenName: object.people[1] ? object.people[1].maidenName : null,
                        PartnerMaritalStatus: object.people[1] ? object.people[1].maritalStatus : null,
                        PartnerMiddleName: object.people[1] ? object.people[1].maidenName : null,
                        PartnerMobile: object.people[1] ? object.people[1].mobileNumber : null,
                        PartnerPostcode: object.people[1] ? object.people[1].addresses[0].postalCode : null,
                        PartnerUnaware: object.people[1] ? false : null,
                        Postcode: object.people[0].addresses[0].postalCode,
                        Salutation: object.people[0].title,
                        Surname: object.people[0].lastName,
                    },
                    Properties: {
                        PropertyRequest: (object.properties || []).map(item => new PropertyTransformer().item(item)),
                    },
                    Vehicles: {
                        VehicleRequest: (object.vehicles || []).map(item => new VehicleTransformer().item(item)),
                    },
                },
                Password: this.credentials.password,
                Username: this.credentials.username,
            },
        };

        return this.removeEmpties(fullCase);
    }

    public items(object: any[]): string {
        return '';
    }
}

export class CaseResultTransformer extends Transformer
    implements XmlToObjectTransformer {
    public xmlItem(xml: string): Promise<CaseResult> {
        return Promise.resolve(xml)
            .then(xml => this.parseXml(xml))
            .then(parsedXml => {
                if (!parsedXml.CreatedAssignment) {
                    throw new PartnerLinkError('Case could not be created', 406);
                }

                return parsedXml.CreatedAssignment;
            })
            .then(parsedSingleResult => {
                const caseResult: CaseResult = new CaseResult();

                caseResult.id = parsedSingleResult.AssignmentID[0];
                caseResult.reference = parsedSingleResult.CaseReference[0];

                return caseResult;
            });
    }

    public xmlItems(xml: string): Promise<CaseResult[]> {
        // Not necessary for this transformer
        return undefined;
    }
}
