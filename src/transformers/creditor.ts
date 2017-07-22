import * as moment from "moment";

import { Transformer } from "./transformer";
import { Creditor } from "../types";

export class CreditorTransformer extends Transformer {
  public parseXmlItem(item: any): Creditor {
    let creditor: Creditor = new Creditor;

    creditor.name = item.CreditorName;
    creditor.creditorType = item.CreditorType;
    creditor.reference = item.AccountReference;
    creditor.accountType = item.AccountType;
    creditor.jointAccount = item.JointAccount === "1" ? true : false;
    creditor.startBalance = this.convertStringToNumber(item.StartBalance);
    creditor.delinquentBalance = this.convertStringToNumber(item.DelinquentBalance);
    creditor.currentBalance = this.convertStringToNumber(item.CurrentBalance);
    creditor.creditStartDate = moment(item.CreditStartDate);
    creditor.creditUpdateDate = moment(item.CreditUpdateDate);
    creditor.creditAmount = this.convertStringToNumber(item.CreditAmount);
    creditor.creditTerms = item.CreditTerms;
    creditor.latestStatus = item.LatestStatus;

    return creditor;
  }

  private convertStringToNumber(value: string): number {
    return Number((parseFloat(value.replace("£", "").replace(",", ""))*100).toFixed(0));
  }
}
