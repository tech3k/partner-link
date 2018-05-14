import { PropertyTransformer } from './property';
import { Property } from '../types';
import * as moment from 'moment';

describe('PropertyTransformer', () => {
  it('should transform single item', () => {
    expect(
      new PropertyTransformer().item({
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
      } as Property),
    ).toEqual({
      AccountNo: '10506714260500',
      AddressLine1: '11',
      AddressLine2: 'High Street',
      AmountOfEquity: 100,
      Applicant: 1,
      City: 'Westbury',
      Country: 'England',
      County: 'Lancashire',
      DebtorShare: 0,
      HomeAddress: true,
      IncludeEquity: false,
      LastRemortgaged: '2014-01-01',
      MonthsInProperty: 6,
      MortgageOutstanding: 12000,
      Owner: 'Joint',
      Ownership: 'Owned',
      Postcode: 'BA13 3BN',
      PreviousAddress: false,
      PrimaryLender: 'LLOYDS TSB',
      PropertyInNameOf: 'Some text',
      PropertyType: 'Detached House',
      PropertyValue: 120000,
      SecuredLoan: 0,
      ThirdPartyOwner: 'Parent',
      TitleNumber: 'Title Num',
      YearsInProperty: 5,
      YearsRemaining: 4,
    });
  });

  it('should return an empty object', () => {
    expect(new PropertyTransformer().items([])).toEqual({});
  });

  it('should transform multiple items', () => {
    const data: Property[] = [
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
    ];

    expect(new PropertyTransformer().items(data)).toEqual({
      Properties: {
        PropertyRequest: [
          {
            AccountNo: '10506714260500',
            AddressLine1: '11',
            AddressLine2: 'High Street',
            AmountOfEquity: 100,
            Applicant: 1,
            City: 'Westbury',
            Country: 'England',
            County: 'Lancashire',
            DebtorShare: 0,
            HomeAddress: true,
            IncludeEquity: false,
            LastRemortgaged: '2014-01-01',
            MonthsInProperty: 6,
            MortgageOutstanding: 12000,
            Owner: 'Joint',
            Ownership: 'Owned',
            Postcode: 'BA13 3BN',
            PreviousAddress: false,
            PrimaryLender: 'LLOYDS TSB',
            PropertyInNameOf: 'Some text',
            PropertyType: 'Detached House',
            PropertyValue: 120000,
            SecuredLoan: 0,
            ThirdPartyOwner: 'Parent',
            TitleNumber: 'Title Num',
            YearsInProperty: 5,
            YearsRemaining: 4,
          },
        ],
      },
    });
  });
});
