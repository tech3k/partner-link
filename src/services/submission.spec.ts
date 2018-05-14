import { Submission } from './submission';
import {
  Asset,
  Case,
  CaseResult,
  Creditor,
  CreditSearchAddressResult,
  Document,
  Expenditure,
  Income,
  NoteRequest,
  PartnerLinkCredentials,
  PartnerLinkError,
  Person,
  Property,
  Vehicle,
} from '../types';
import * as moment from 'moment';

beforeEach(() => {
  jest
    .spyOn(Submission.prototype, 'getJwt')
    .mockImplementation(async () => await 'token');
});

describe('Submission: createFullCase', () => {
  it('should create a full case', async () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => {
        return await `<CreatedAssignment xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/PartnerLinkCaseAPI.Models">
	<AssignmentID>32059</AssignmentID>
	<CaseReference>TESTCRFIX1-300</CaseReference>
</CreatedAssignment>`;
      });

    const service = new Submission({} as PartnerLinkCredentials);
    const data = {
      people: [
        {
          title: 'Mr',
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: moment('1990-01-01'),
          gender: 'F',
          addresses: [
            {
              id: '58150008380',
              address1: '12',
              address2: 'High St',
              town: 'Westbury',
              county: 'Manchester',
              postalCode: 'M1 6NG',
              surname: 'Doe',
            } as CreditSearchAddressResult,
          ],
          homeNumber: '01610000000',
          mobileNumber: '07000000000',
          emailAddress: 'a@b.c',
          employmentStatus: 'Employed',
          employerName: 'Employer',
          jobTitle: 'Job Title',
          maritalStatus: 'Single',
        } as Person,
      ],
      dependants: [moment().subtract(1.1)],
      expenditure: [{ name: 'FOOD', value: 45000 } as Expenditure],
      income: [{ name: 'CLIENT_EARNINGS', value: 250000 } as Income],
      assets: [
        {
          applicant: 1,
          assetOwner: 'single',
          assetType: 'Investment',
          assetValue: 50000,
          note: 'Some text',
        } as Asset,
      ],
      properties: [
        {
          accountNo: '10506714260500',
          address1: '11',
          address2: 'High Street',
          amountOfEquity: 10000,
          applicant: 1,
          city: 'Westbury',
          country: 'England',
          county: 'Lancashire',
          debtorShare: 0,
          homeAddress: true,
          includeEquity: false,
          lastRemortgaged: moment('2014-01-01'),
          monthsInProperty: 6,
          mortgageOutstanding: 12000,
          owner: 'Joint',
          ownership: 'Owned',
          postalCode: 'BA13 3BN',
          previousAddress: false,
          primaryLender: 'LLOYDS TSB',
          propertyInNameOf: 'Some text',
          propertyType: 'Detached House',
          propertyValue: 12000000,
          securedLoan: 0,
          thirdPartyOwner: 'Parent',
          titleNumber: 'Title Num',
          yearsInProperty: 5,
          yearsRemaining: 4,
        } as Property,
      ],
      vehicles: [
        {
          adaptedFordisabledUse: false,
          amountAdvanced: 20000,
          amountOutstanding: 30000,
          applicant: 2,
          balloonPayment: 0,
          dateOfAdvance: moment('2015-12-01'),
          dateOfRegistration: moment('2013-10-20'),
          defaulted: false,
          endDate: moment('2017-10-01'),
          financeOustanding: false,
          financeType: 'Bank Loan',
          reference: '3274626436464',
          make: 'Ford',
          model: 'Escort',
          monthlyCost: 10000,
          registrationNumber: 'YY55 DZD',
          termInMonths: 12,
          age: 2,
          mileage: 10000,
          necessary: false,
          useType: 'Work',
          value: 3000000,
        } as Vehicle,
      ],
    } as Case;
    expect(await service.createFullCase(data)).toEqual({
      id: '32059',
      reference: 'TESTCRFIX1-300',
    } as CaseResult);
  });

  it('should throw error', async () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => {
        return await `<CreatedAssignment xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/PartnerLinkCaseAPI.Models">
	<AssignmentID>32059</AssignmentID>
	<CaseReference>TESTCRFIX1-300</CaseReference>
</CreatedAssignment>`;
      });

    const service = new Submission({} as PartnerLinkCredentials);
    expect(service.createFullCase({} as Case)).rejects.toThrowError(
      PartnerLinkError,
    );
  });
});

describe('Submission: addAddresses', () => {
  it('add address should be successful', async () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => await '');

    expect(
      await new Submission({} as PartnerLinkCredentials).addAddresses(
        {} as CaseResult,
        [] as CreditSearchAddressResult[],
      ),
    ).toEqual({} as CaseResult);
  });

  it('add address should throw error', () => {
    jest.spyOn(Submission.prototype, 'postRequest').mockImplementation(() => {
      throw new Error('Whoops');
    });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addAddresses(
        {} as CaseResult,
        [] as CreditSearchAddressResult[],
      ),
    ).rejects.toThrowError('Unable to submit addresses (Whoops).');
  });
});

describe('Submission: addNotes', () => {
  it('should resolve request', () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => await '');

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addNotes({} as CaseResult, {} as NoteRequest),
    ).resolves.toEqual({});
  });

  it('should reject request', () => {
    jest.spyOn(Submission.prototype, 'postRequest').mockImplementation(() => {
      throw new Error('Hello');
    });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addNotes({} as CaseResult, {} as NoteRequest),
    ).rejects.toThrowError('Unable to submit notes (Hello).');
  });
});

describe('Submission: addCreditor', () => {
  it('should resolve request', () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => await '');

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addCreditor(
        { id: '0001', reference: 'ref' } as CaseResult,
        {} as Creditor,
      ),
    ).resolves.toEqual({ id: '0001', reference: 'ref' } as CaseResult);
  });

  it('should resolve reject request', () => {
    jest
      .spyOn(Submission.prototype, 'postRequest')
      .mockImplementation(async () => {
        throw new Error('420');
      });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addCreditor({} as CaseResult, {} as Creditor),
    ).rejects.toThrowError('Unable to submit creditors (420).');
  });
});

describe('Submission: addDocuments', () => {
  it('should resolve successfully', () => {
    jest
      .spyOn(Submission.prototype, 'tokenPostRequest')
      .mockImplementation(async () => await '');

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addDocuments({} as CaseResult, [] as Document[]),
    ).resolves.toEqual({} as CaseResult);
  });

  it('should reject promise', () => {
    jest
      .spyOn(Submission.prototype, 'addDocument')
      .mockImplementationOnce(async () => {
        throw new Error('yolo');
      });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addDocuments({} as CaseResult, [{}] as Document[]),
    ).rejects.toThrowError('Unable to submit documents (yolo).');
  });
});

describe('Submission: addDocument', () => {
  it('should resolve successfully', () => {
    jest
      .spyOn(Submission.prototype, 'tokenPostRequest')
      .mockImplementation(async () => {
        return await '';
      });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addDocument({} as CaseResult, {} as Document),
    ).resolves.toEqual({});
  });

  it('should reject promise', () => {
    jest
      .spyOn(Submission.prototype, 'tokenPostRequest')
      .mockImplementation(async () => {
        throw new Error('ha');
      });

    const cred = {} as PartnerLinkCredentials;
    return expect(
      new Submission(cred).addDocument(
        {} as CaseResult,
        { fileName: 'secret.txt' } as Document,
      ),
    ).rejects.toThrowError('Unable to submit document secret.txt');
  });
});
