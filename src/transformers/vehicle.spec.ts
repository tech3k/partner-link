import { VehicleTransformer } from './vehicle';
import { Vehicle } from '../types';
import * as moment from 'moment';

describe('Vehicle Transformer', () => {
  it('Should return minimal ie nulls', () => {
    const data = { make: 'Ford', model: 'Ka' } as Vehicle;

    expect(new VehicleTransformer().item(data)).toEqual({
      AdaptedForDisabledUse: null,
      AmountAdvanced: null,
      AmountOutstanding: null,
      Applicant: 1,
      BalloonPayment: null,
      DateOfAdvance: null,
      DateOfRegistration: null,
      DefaultedOnTheLoan: null,
      EndDate: null,
      FinanceOutstanding: null,
      FinanceType: null,
      LoanReferenceNo: null,
      Make: 'Ford', // Required
      Model: 'Ka', // Required
      MonthlyCost: null,
      RegistrationNo: null,
      TermInMonths: null,
      VehicleAge: null,
      VehicleMileage: null,
      VehicleNecessary: null,
      VehicleUse: 'Personal', // Required if VehicleUseID is empty; Value from Add Vehicle (Use)
      VehicleValue: null,
    });
  });

  it('Should return full information', () => {
    const data = {
      adaptedFordisabledUse: false,
      amountAdvanced: 20000,
      amountOutstanding: 30000,
      applicant: 2,
      balloonPayment: 0,
      dateOfAdvance: moment('2015-12-01'),
      dateOfRegistration: moment('2013-10-20'),
      defaulted: false,
      endDate: moment('2017-10-01'),
      financeOustanding: false,
      financeType: 'Bank Loan',
      reference: '3274626436464',
      make: 'Ford',
      model: 'Escort',
      monthlyCost: 10000,
      registrationNumber: 'YY55 DZD',
      termInMonths: 12,
      age: 2,
      mileage: 10000,
      necessary: false,
      useType: 'Work',
      value: 3000000,
    } as Vehicle;

    expect(new VehicleTransformer().item(data)).toEqual({
      AdaptedForDisabledUse: false,
      AmountAdvanced: 200,
      AmountOutstanding: 300,
      Applicant: 2,
      BalloonPayment: 0,
      DateOfAdvance: '2015-12-01',
      DateOfRegistration: '2013-10-20',
      DefaultedOnTheLoan: false,
      EndDate: '2017-10-01',
      FinanceOutstanding: false,
      FinanceType: 'Bank Loan',
      LoanReferenceNo: '3274626436464',
      Make: 'Ford',
      Model: 'Escort',
      MonthlyCost: 100,
      RegistrationNo: 'YY55 DZD',
      TermInMonths: 12,
      VehicleAge: 2,
      VehicleMileage: 10000,
      VehicleNecessary: false,
      VehicleUse: 'Work',
      VehicleValue: 30000,
    });
  });

  it('should return an array of vehicles', () => {
    const data = [
      {
        adaptedFordisabledUse: false,
        amountAdvanced: 20000,
        amountOutstanding: 30000,
        applicant: 2,
        balloonPayment: 0,
        dateOfAdvance: moment('2015-12-01'),
        dateOfRegistration: moment('2013-10-20'),
        defaulted: false,
        endDate: moment('2017-10-01'),
        financeOustanding: false,
        financeType: 'Bank Loan',
        reference: '3274626436464',
        make: 'Ford',
        model: 'Escort',
        monthlyCost: 10000,
        registrationNumber: 'YY55 DZD',
        termInMonths: 12,
        age: 2,
        mileage: 10000,
        necessary: false,
        useType: 'Work',
        value: 3000000,
      } as Vehicle,
    ];

    expect(new VehicleTransformer().items(data)).toEqual({
      Vehicles: {
        VehicleRequest: [
          {
            AdaptedForDisabledUse: false,
            AmountAdvanced: 200,
            AmountOutstanding: 300,
            Applicant: 2,
            BalloonPayment: 0,
            DateOfAdvance: '2015-12-01',
            DateOfRegistration: '2013-10-20',
            DefaultedOnTheLoan: false,
            EndDate: '2017-10-01',
            FinanceOutstanding: false,
            FinanceType: 'Bank Loan',
            LoanReferenceNo: '3274626436464',
            Make: 'Ford',
            Model: 'Escort',
            MonthlyCost: 100,
            RegistrationNo: 'YY55 DZD',
            TermInMonths: 12,
            VehicleAge: 2,
            VehicleMileage: 10000,
            VehicleNecessary: false,
            VehicleUse: 'Work',
            VehicleValue: 30000,
          },
        ],
      },
    });
  });

  it('should return an empty object', () => {
    expect(new VehicleTransformer().items([])).toEqual({});
  });
});
