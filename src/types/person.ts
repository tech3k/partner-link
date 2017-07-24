import * as moment from "moment";

import { CreditSearchAddressResult, Creditor } from "./";

export class CreditSearchPerson {
  public clientReference: string;
  public title: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth: moment.Moment;
  public addresses: CreditSearchAddressResult[];
}

export class CreditSearchPersonResult {
  id: number;
  creditors: Creditor[];
  report: string;
}

export class Person {
  public title: string;
  public firstName: string;
  public middleNames: string;
  public lastName: string;
  public maidenName?: string;
  public dateOfBirth: moment.Moment;
  public gender: string;
  public addresses: CreditSearchAddressResult[];
  public homeNumber: string;
  public mobileNumber: string;
  public emailAddress: string;
  public employmentStatus: string;
  public employerName: string;
  public jobTitle: string;
}
