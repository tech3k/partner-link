import {
  ExpenditureTransformer,
  IncomeTransformer,
} from './income-expenditure';
import { Expenditure, Income } from '../types';

describe('Income Transformer', () => {
  it('should transform a single item', () => {
    expect(
      new IncomeTransformer().item({
        name: 'CLIENT_EARNINGS',
        value: 250000,
        customName: null,
      } as Income),
    ).toEqual({
      Name: 'CLIENT_EARNINGS',
      Value: '2500',
      UserDefinedName: null,
    });
  });

  it('should return an empty object', () => {
    expect(new IncomeTransformer().items([])).toEqual({});
  });

  it('should transform multiple items', () => {
    const data: Income[] = [
      {
        name: 'CLIENT_EARNINGS',
        value: 250000,
      } as Income,
      {
        name: 'OTHER_INCOME_1',
        value: 60000,
        customName: 'Second Job',
      } as Income,
    ];

    expect(new IncomeTransformer().items(data)).toEqual({
      IncomeFields: {
        IncomeField: [
          {
            Name: 'CLIENT_EARNINGS',
            Value: '2500',
            UserDefinedName: null,
          },
          {
            Name: 'OTHER_INCOME_1',
            Value: '600',
            UserDefinedName: 'Second Job',
          },
        ],
      },
    });
  });
});

describe('Expenditure Transformer', () => {
  it('should transform a single item', () => {
    expect(
      new ExpenditureTransformer().item({
        name: 'MORTGAGE',
        value: 30000,
      } as Expenditure),
    ).toEqual({
      Name: 'MORTGAGE',
      Value: '300',
    });
  });

  it('should return an empty object', () => {
    expect(new ExpenditureTransformer().items([])).toEqual({});
  });

  it('should transform multiple items', () => {
    const data: Expenditure[] = [
      {
        name: 'MORTGAGE',
        value: 30000,
      } as Expenditure,
      {
        name: 'FOOD',
        value: 45000,
      } as Expenditure,
    ];

    expect(new ExpenditureTransformer().items(data)).toEqual({
      ExpenditureFields: {
        ExpenditureField: [
          {
            Name: 'MORTGAGE',
            Value: '300',
          },
          {
            Name: 'FOOD',
            Value: '450',
          },
        ],
      },
    });
  });
});
