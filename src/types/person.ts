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
  id: string;
  creditors: Creditor[];
  report: string;
}
