import { CaseResultTransformer, CaseTransformer } from './case';
import {
  Case,
  CreditSearchAddressResult,
  PartnerLinkCredentials,
  PartnerLinkError,
  Person,
} from '../types';
import * as moment from 'moment';

describe('CaseTransformer', () => {
  it('should throw error, no employment status', () => {
    function build1() {
      new CaseTransformer({}).item({} as Case);
    }

    function build2() {
      new CaseTransformer({}).item({
        people: [{} as Person],
        dependants: [],
        expenditure: [],
        income: [],
        assets: [],
        properties: [],
        vehicles: [],
      } as Case);
    }

    expect(build1).toThrowError(PartnerLinkError);
    expect(build2).toThrowError(PartnerLinkError);
    expect(build1).toThrowError('No Employment Status has been provided');
  });

  it('should throw error, no contact number', () => {
    function build() {
      new CaseTransformer({}).item({
        people: [
          {
            employmentStatus: 'Full Time',
          } as Person,
        ],
      } as Case);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No home telephone number has been provided.');
  });

  it('should throw error, no date of birth', () => {
    const caseData = {
      people: [
        {
          employmentStatus: 'Full Time',
          homeNumber: '016100000000',
        },
      ],
    } as Case;

    function build() {
      return new CaseTransformer({} as PartnerLinkCredentials).item(caseData);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No date of birth provided.');
  });

  it('should throw error, no address provided', () => {
    const caseData = {
      people: [
        {
          employmentStatus: 'Full Time',
          homeNumber: '016100000000',
          dateOfBirth: moment('1990-01-01'),
        },
      ],
    } as Case;

    function build() {
      return new CaseTransformer({} as PartnerLinkCredentials).item(caseData);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No address has been provided.');

    // empty array
    caseData.people[0].addresses = [];
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No address has been provided.');

    // blank object
    caseData.people[0].addresses = [{} as CreditSearchAddressResult];
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No address has been provided.');

    // blank address
    caseData.people[0].addresses[0].address1 = '';
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No address has been provided.');
  });

  it('should throw error, partner no date of birth', () => {
    const caseData = {
      people: [
        {
          employmentStatus: 'Full Time',
          homeNumber: '016100000000',
          dateOfBirth: moment('1990-01-01'),
          addresses: [{ address1: '12' }],
        },
        {},
      ],
    } as Case;

    function build() {
      return new CaseTransformer({} as PartnerLinkCredentials).item(caseData);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('Partner, No date of birth provided');
  });

  it('should throw error, partner no address', () => {
    const caseData = {
      people: [
        {
          employmentStatus: 'Full Time',
          homeNumber: '016100000000',
          dateOfBirth: moment('1990-01-01'),
          addresses: [{ address1: '12' }],
        },
        {
          dateOfBirth: moment('1988-01-01'),
        },
      ],
    } as Case;

    function build() {
      return new CaseTransformer({} as PartnerLinkCredentials).item(caseData);
    }

    // expect(build).toThrowError('Partner, No address has been provided');
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('Partner, No address has been provided');

    // empty array
    caseData.people[1].addresses = [];
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('Partner, No address has been provided');

    // empty object
    caseData.people[1].addresses.push({} as CreditSearchAddressResult);
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('Partner, No address has been provided');

    // empty address1
    caseData.people[1].addresses[0].address1 = '';
    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('Partner, No address has been provided');
  });

  it('should throw error, partner mo employment status', () => {
    const caseData = {
      people: [
        {
          employmentStatus: 'Full Time',
          homeNumber: '016100000000',
          dateOfBirth: moment('1990-01-01'),
          addresses: [{ address1: '12' }],
        },
        {
          dateOfBirth: moment('1988-01-01'),
          addresses: [{ address1: '12' }],
        },
      ],
    } as Case;

    function build() {
      return new CaseTransformer({} as PartnerLinkCredentials).item(caseData);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError(
      'Partner, No Employment Status has been provided.',
    );

    //
  });

  it('should return a transformed item', () => {
    const data = {
      people: [
        {
          employmentStatus: 'Full Time',
          employerName: 'Debt Support Centre Ltd',
          homeNumber: '01610000000',
          mobileNumber: '0700000000',
          addresses: [
            {
              address1: '11',
              address2: 'High Street',
              postalCode: 'BA13 3BN',
            } as CreditSearchAddressResult,
          ],
          dateOfBirth: moment('1980-10-01'),
          jobTitle: 'Lawyer',
        } as Person,
      ],
      dependants: [moment().subtract(7.2, 'year')],
      expenditure: [
        {
          name: 'MORTGAGE',
          value: 30000,
        },
      ],
      income: [
        {
          name: 'CLIENT_EARNINGS',
          value: 250000,
          customName: 'Rent',
        },
      ],
      assets: [
        {
          assetOwner: 'Single',
          assetType: 'Investment',
          assetValue: 10000,
          note: 'Some text',
        },
      ],
    } as Case;

    expect(
      new CaseTransformer({ username: 'stoko', password: 'Password1' }).item(
        data,
      ),
    ).toEqual({
      CreateFullCaseRequest: {
        CaseDetails: {
          CaseMainDetails: {
            AddressCountryID: 1,
            ContactMade: true,
            Joint: false,
          },
          EmploymentDetails: {
            EmployerName: 'Debt Support Centre Ltd',
            EmploymentStatus: 'Full Time',
            JobTitle: 'Lawyer',
          },
          Expenditure: {
            ExpenditureFields: {
              ExpenditureField: [
                {
                  Name: 'MORTGAGE',
                  Value: '300',
                },
              ],
            },
          },
          Income: {
            IncomeFields: {
              IncomeField: [
                {
                  Name: 'CLIENT_EARNINGS',
                  Value: '2500',
                  UserDefinedName: 'Rent',
                },
              ],
            },
          },
          OtherAssets: {
            OtherAssetRequest: [
              {
                Applicant: 1,
                AssetOwner: 'Single',
                AssetType: 'Investment',
                AssetValue: 100,
                Notes: 'Some text',
              },
            ],
          },
          PersonalDetails: {
            AddressLine1: '11',
            AddressLine2: 'High Street',
            CountryID: 1,
            DateOfBirth: '1980-10-01',
            DependantsList: { Dependant: [{ Age: 7 }] },
            HomeTelephone: '01610000000',
            JointApplicant: false,
            Mobile: '0700000000',
            Postcode: 'BA13 3BN',
          },
          Properties: { PropertyRequest: [] },
          Vehicles: { VehicleRequest: [] },
        },
        Password: 'Password1',
        Username: 'stoko',
      },
    });
  });

  it('should return an empty object', () => {
    expect(new CaseTransformer({}).items([])).toBe('');
  });
});

describe('CaseResultTransformer', () => {
  it('should return undefined', () => {
    expect(new CaseResultTransformer({}).xmlItems('')).toEqual(undefined);
  });

  it('should throw error, Case could not be created', () => {
    const xml = `<ErrorDetails></ErrorDetails>`;
    expect(new CaseResultTransformer({}).xmlItem(xml)).rejects.toThrowError(
      PartnerLinkError,
    );
    expect(new CaseResultTransformer({}).xmlItem(xml)).rejects.toThrowError(
      'Case could not be created',
    );
  });
});
