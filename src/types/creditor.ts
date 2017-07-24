import * as moment from "moment";

export class Creditor {
  public name: string;
  public creditorType: string;
  public reference: string;
  public accountType: string;
  public jointAccount: boolean;
  public startBalance: number;
  public delinquentBalance: number;
  public currentBalance: number;
  public creditStartDate: moment.Moment;
  public creditUpdateDate: moment.Moment;
  public creditAmount: number;
  public creditTerms: string;
  public latestStatus: string;
  public applicant?: number;
  public source?: string;
  public owner?: number;
  public creditCheck?: boolean;
}
