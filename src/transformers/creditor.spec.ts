import { CreditorTransformer } from './creditor';
import { Creditor } from '../types';
import * as moment from 'moment';
import * as xml2js from 'xml2js';

describe('CreditorTransformer', () => {
  it('should transform a single item', () => {
    const data = {
      name: '4 u phones Ltd',
      creditorType: 'Communications Supplier',
      jointAccount: false,
      startBalance: 10000,
      delinquentBalance: 1000,
      currentBalance: 1000,
      creditStartDate: moment('2014-12-12'),
      creditUpdateDate: moment('2015-09-16'),
      creditAmount: 10000,
      latestStatus: 'Settled',
      applicant: 1,
      creditCheck: true,
    } as Creditor;

    expect(new CreditorTransformer({}).item(data)).toEqual({
      AccountReference: null,
      Applicant: 1,
      CreditStatus: 'Settled',
      CreditorSource: 'Credit Check',
      CurrentBalance: 10,
      DebtOwner: 'single',
      DelinquentBalance: 10,
      ExternalCreditCheck: true,
      Name: '4 U PHONES LTD',
      StartBalance: 100,
      StartDate: '2014-12-12',
      TotalBalance: 100,
      Type: 'Communications Supplier',
      UpdateDate: '2015-09-16',
    });
  });

  it('should return an empty object', () => {
    expect(new CreditorTransformer({}).items([])).toEqual({});
  });

  it('should transform multiple items', () => {
    const data: Creditor[] = [
      {
        reference: '123456',
        name: '4 u phones Ltd',
        creditorType: 'Retailer',
        jointAccount: true,
        startBalance: 10000,
        delinquentBalance: 1000,
        currentBalance: 1000,
        creditStartDate: null,
        creditUpdateDate: null,
        creditAmount: 10000,
        latestStatus: 'Settled',
        creditCheck: false,
      } as Creditor,
    ];

    expect(
      new CreditorTransformer({
        username: 'stoko',
        password: 'Password1',
      }).items(data),
    ).toEqual({
      AddCreditorsRequest: {
        Creditors: {
          CreditorDetails: [
            {
              AccountReference: '123456',
              Applicant: 1,
              CreditStatus: 'Settled',
              CreditorSource: 'Provided By Client',
              CurrentBalance: 10,
              DebtOwner: 'joint',
              DelinquentBalance: 10,
              ExternalCreditCheck: false,
              Name: '4 U PHONES LTD',
              StartBalance: 100,
              TotalBalance: 100,
              Type: 'Home Lending',
            },
          ],
        },
        Password: 'Password1',
        Username: 'stoko',
      },
    });
  });

  it('should parse an already converted xml item', () => {
    const data = {
      CreditorName: '4 U PHONES LTD',
      CreditorType: 'Communications Supplier',
      AccountReference: '123456',
      AccountType: 'type',
      JointAccount: '1',
      StartBalance: '100',
      DelinquentBalance: '10',
      CurrentBalance: '10',
      CreditStartDate: '2014-12-12',
      CreditUpdateDate: '2015-09-16',
      CreditAmount: '100',
      CreditTerms: 5,
      LatestStatus: 'status',
    };

    const creditor = new Creditor();
    creditor.name = '4 U PHONES LTD';
    creditor.creditorType = 'Communications Supplier';
    creditor.reference = '123456';
    creditor.accountType = 'type';
    creditor.jointAccount = true;
    creditor.startBalance = 10000;
    creditor.delinquentBalance = 1000;
    creditor.currentBalance = 1000;
    creditor.creditStartDate = moment('2014-12-12');
    creditor.creditUpdateDate = moment('2015-09-16');
    creditor.creditAmount = 10000;
    creditor.creditTerms = 5;
    creditor.latestStatus = 'status';

    expect(new CreditorTransformer({}).parseXmlItem(data)).toEqual(creditor);
  });
});
