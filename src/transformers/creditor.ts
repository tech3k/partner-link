import * as moment from "moment";

import { Transformer, ObjectToXmlTransformer } from "./transformer";
import { Creditor } from "../types";

export class CreditorTransformer extends Transformer implements ObjectToXmlTransformer {
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

  item(object: Creditor): string {
    return `
<AddCreditorsRequest>
<Creditors>
<CreditorDetails>
<AccountReference>${object.reference}</AccountReference>
<Applicant>${object.applicant}</Applicant>
<CreditStatus>Settled</CreditStatus>
<CreditorSource>${object.creditCheck ? 'Credit Check' : 'Provided By Client'}</CreditorSource>
<CurrentBalance>${object.currentBalance / 100}</CurrentBalance>
<DebtOwner>${object.jointAccount ? "joint" : "single"}</DebtOwner>
<DelinquentBalance>${object.delinquentBalance / 100}</DelinquentBalance>
<ExternalCreditCheck>${object.creditCheck ? 'true' : 'false'}</ExternalCreditCheck>
<Name>${object.name}</Name>
<StartBalance>${object.startBalance / 100}</StartBalance>
<StartDate>${object.creditStartDate.format("YYYY-MM-DD")}</StartDate>
<TotalBalance>${object.creditAmount / 100}</TotalBalance>
<Type>${object.creditorType}</Type>
<UpdateDate>${object.creditUpdateDate.format("YYYY-MM-DD")}</UpdateDate>
</CreditorDetails>
</Creditors>
<Password>${this.credentials.password}</Password>
<Username>${this.credentials.username}</Username>
</AddCreditorsRequest>
    `;
  }

  items(object: Creditor[]): string {
    if (object === undefined || object.length === 0) { return ''; }

    return `
<OtherAssets>
  ${object.map(item => this.item(item)).join("\n")}
</OtherAssets>
    `;
  }

}
