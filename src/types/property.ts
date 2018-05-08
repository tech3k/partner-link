import * as moment from 'moment';

export class Property {
  public accountNo: string;
  public address1: string;
  public address2: string;
  public amountOfEquity: number;
  public applicant: number;
  public city: string;
  public country: string;
  public county: string;
  public debtorShare: number;
  public homeAddress: boolean;
  public includeEquity: boolean;
  public lastRemortgaged: moment.Moment;
  public monthsInProperty: number;
  public mortgageOutstanding: number;
  public owner: string;
  public ownership: string;
  public postalCode: string;
  public previousAddress: boolean;
  public primaryLender: string;
  public propertyInNameOf: string;
  public propertyType: string;
  public propertyValue: number;
  public securedLoan: boolean;
  public thirdPartyOwner: number;
  public titleNumber: string;
  public yearsInProperty: number;
  public yearsRemaining: number;
}
