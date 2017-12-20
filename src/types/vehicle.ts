import * as moment from "moment";

export class Vehicle {
  public adaptedFordisabledUse: boolean;
  public amountAdvanced: number;
  public amountOutstanding: number;
  public applicant: number;
  public balloonPayment: number;
  public dateOfAdvance: moment.Moment;
  public dateOfRegistration: moment.Moment;
  public defaulted: boolean;
  public endDate: moment.Moment;
  public financeOustanding: boolean;
  public financeType: string;
  public reference: string;
  public make: string;
  public model: string;
  public monthlyCost: number;
  public registrationNumber: string;
  public termInMonths: number;
  public age: number;
  public mileage: number;
  public necessary: boolean;
  public useType: string;
  public value: number;
}
