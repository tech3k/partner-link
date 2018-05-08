import { Vehicle } from '../types';
import { ObjectToXmlTransformer } from './transformer';

export class VehicleTransformer implements ObjectToXmlTransformer {
  public item(object: Vehicle) {
    return {
      AdaptedForDisabledUse:
        object.adaptedFordisabledUse !== undefined
          ? object.adaptedFordisabledUse
          : null,
      AmountAdvanced: object.amountAdvanced
        ? object.amountAdvanced / 100
        : null,
      AmountOutstanding: object.amountOutstanding
        ? object.amountOutstanding / 100
        : null,
      Applicant: object.applicant ? object.applicant : 1,
      BalloonPayment:
        object.balloonPayment !== undefined ? object.balloonPayment : null,
      DateOfAdvance: object.dateOfAdvance
        ? object.dateOfAdvance.format('YYYY-MM-DD')
        : null,
      DateOfRegistration: object.dateOfRegistration
        ? object.dateOfRegistration.format('YYYY-MM-DD')
        : null,
      DefaultedOnTheLoan:
        object.defaulted !== undefined ? object.defaulted : null,
      EndDate: object.endDate ? object.endDate.format('YYYY-MM-DD') : null,
      FinanceOutstanding:
        object.financeOustanding !== undefined
          ? object.financeOustanding
          : null,
      FinanceType: object.financeType ? object.financeType : null,
      LoanReferenceNo: object.reference ? object.reference : null,
      Make: object.make,
      Model: object.model,
      MonthlyCost: object.monthlyCost ? object.monthlyCost / 100 : null,
      RegistrationNo: object.registrationNumber
        ? object.registrationNumber
        : null,
      TermInMonths: object.termInMonths ? object.termInMonths : null,
      VehicleAge: object.age ? object.age : null,
      VehicleMileage: object.mileage ? object.mileage : null,
      VehicleNecessary:
        object.necessary !== undefined ? object.necessary : null,
      VehicleUse: object.useType ? object.useType : 'Personal',
      VehicleValue: object.value ? object.value / 100 : null,
    };
  }

  public items(object: Vehicle[]) {
    if (!object || !object.length) {
      return {};
    }

    return {
      Vehicles: { VehicleRequest: object.map(item => this.item(item)) },
    };
  }
}
