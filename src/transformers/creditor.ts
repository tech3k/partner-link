import * as moment from 'moment';
import { Creditor } from '../types';
import { ObjectToXmlTransformer, Transformer } from './transformer';

export class CreditorTransformer extends Transformer
  implements ObjectToXmlTransformer {
  public parseXmlItem(item: any): Creditor {
    const creditor: Creditor = new Creditor();

    creditor.name = item.CreditorName;
    creditor.creditorType = item.CreditorType;
    creditor.reference = item.AccountReference;
    creditor.accountType = item.AccountType;
    creditor.jointAccount = item.JointAccount === '1'; // !!Number(item.JointAccount))
    creditor.startBalance = this.convertStringToNumber(item.StartBalance);
    creditor.delinquentBalance = this.convertStringToNumber(
      item.DelinquentBalance,
    );
    creditor.currentBalance = this.convertStringToNumber(item.CurrentBalance);
    creditor.creditStartDate = moment(item.CreditStartDate);
    creditor.creditUpdateDate = moment(item.CreditUpdateDate);
    creditor.creditAmount = item.CreditAmount
      ? this.convertStringToNumber(item.CreditAmount)
      : null;
    creditor.creditTerms = item.CreditTerms;
    creditor.latestStatus = item.LatestStatus;

    return creditor;
  }

  public item(object: Creditor) {
    // transform credit type from Equifax to Partner-Link
    const trans = {
      'Retailer': 'Home Lending',
      'Basic Bank Account': 'Current Account',
    };

    return {
      AccountReference: object.reference ? object.reference : null,
      Applicant: object.applicant ? object.applicant : 1,
      CreditStatus: object.latestStatus,
      CreditorSource: object.creditCheck
        ? 'Credit Check'
        : 'Provided By Client',
      CurrentBalance: object.currentBalance / 100,
      DebtOwner: object.jointAccount ? 'joint' : 'single',
      DelinquentBalance: object.delinquentBalance / 100,
      ExternalCreditCheck: object.creditCheck,
      Name: (object.name || '').toUpperCase(),
      StartBalance: object.startBalance / 100,
      StartDate: object.creditStartDate
        ? object.creditStartDate.format('YYYY-MM-DD')
        : null,
      TotalBalance: object.creditAmount / 100,
      Type: trans[object.creditorType] ? trans[object.creditorType] : object.creditorType, // transformer hax
      UpdateDate: object.creditUpdateDate
        ? object.creditUpdateDate.format('YYYY-MM-DD')
        : null,
    };
  }

  public items(object: Creditor[]) {
    if (!object || !object.length) {
      return {};
    }

    const creditors = {
      AddCreditorsRequest: {
        Creditors: { CreditorDetails: object.map(item => this.item(item)) },
        Password: this.credentials.password,
        Username: this.credentials.username,
      },
    };

    return this.removeEmpties(creditors);
  }

  private convertStringToNumber(value: string): number {
    return Number(
      (parseFloat(value.replace('£', '').replace(',', '')) * 100).toFixed(0),
    );
  }
}
