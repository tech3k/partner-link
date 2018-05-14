import * as moment from 'moment';
import {
  Vehicle,
  Property,
  Asset,
  Income,
  Expenditure,
  Person,
  DocumentRequest,
} from './';

export class Case {
  public people: Person[];
  public dependants?: moment.Moment[];
  public expenditure: Expenditure[];
  public income: Income[];
  public assets?: Asset[];
  public properties?: Property[];
  public vehicles?: Vehicle[];
}

export class CaseResult {
  public id: string;
  public reference: string;
}

export class CaseMainDetails {
  public addressCountryID: number;
  public contactMade: boolean;
  public firstName: string;
  public gender: string;
  public joint: boolean;
  public maidenName: string;
  public partnerUnaware: boolean;
  public salutation: string;
  public surname: string;
}
