import {CreditorTransformer} from './creditor';
import {Creditor} from '../types';
import * as moment from 'moment';
import * as xml2js from 'xml2js';

describe('Creditor transformer', () => {
    it('should transform a single item', () => {
        const data = {
            name: '4 u phones Ltd',
            creditorType: 'Communications Supplier',
            jointAccount: false,
            startBalance: 10000,
            delinquentBalance: 1000,
            currentBalance: 1000,
            creditStartDate: moment('2014-12-12'),
            creditUpdateDate: moment('2015-09-16'),
            creditAmount: 10000,
            latestStatus: 'Settled',
            applicant: 1,
            creditCheck: true,
        } as Creditor;

        expect(new CreditorTransformer({}).item(data)).toEqual({
            AccountReference: null,
            Applicant: 1,
            CreditStatus: 'Settled',
            CreditorSource: 'Credit Check',
            CurrentBalance: 10,
            DebtOwner: 'single',
            DelinquentBalance: 10,
            ExternalCreditCheck: true,
            Name: '4 U PHONES LTD',
            StartBalance: 100,
            StartDate: '2014-12-12',
            TotalBalance: 100,
            Type: 'Communications Supplier',
            UpdateDate: '2015-09-16',
        });
    });

    it('should return an empty object', () => {
        expect(new CreditorTransformer({}).items([])).toEqual({});
    });

    it('should transform multiple items', () => {
        const data: Creditor[] = [{
            reference: '123456',
            name: '4 u phones Ltd',
            creditorType: 'Retailer',
            jointAccount: true,
            startBalance: 10000,
            delinquentBalance: 1000,
            currentBalance: 1000,
            creditStartDate: null,
            creditUpdateDate: null,
            creditAmount: 10000,
            latestStatus: 'Settled',
            creditCheck: false,
        } as Creditor];

        expect(new CreditorTransformer({username: 'stoko', password: 'Password1'}).items(data)).toEqual({
            AddCreditorsRequest: {
                Creditors: {
                    CreditorDetails: [{
                        AccountReference: '123456',
                        Applicant: 1,
                        CreditStatus: 'Settled',
                        CreditorSource: 'Provided By Client',
                        CurrentBalance: 10,
                        DebtOwner: 'joint',
                        DelinquentBalance: 10,
                        ExternalCreditCheck: false,
                        Name: '4 U PHONES LTD',
                        StartBalance: 100,
                        TotalBalance: 100,
                        Type: 'Home Lending',
                    }],
                },
                Password: 'Password1',
                Username: 'stoko',
            },
        });
    });

    // it('should convert an xml string from an object', async () => {
    //
    //     const xmlStr = `<CreditorDetails>
		// 	<AccountReference>123456</AccountReference>
		// 	<Applicant>1</Applicant>
		// 	<CommonCreditor>PHONES4U (I)</CommonCreditor>
		// 	<CommonCreditorId>88548</CommonCreditorId>
		// 	<CreditStatus>Settled</CreditStatus>
		// 	<CreditStatusId>2</CreditStatusId>
		// 	<CreditorSource>Credit Check</CreditorSource>
		// 	<CreditorSourceId>1</CreditorSourceId>
		// 	<CurrentBalance>10</CurrentBalance>
		// 	<DebtOwner>Single</DebtOwner>
		// 	<DebtOwnerId>1</DebtOwnerId>
		// 	<DelinquentBalance>10</DelinquentBalance>
		// 	<EndDate>2018-10-01</EndDate>
		// 	<ExternalCreditCheck>true</ExternalCreditCheck>
		// 	<Name>4 U PHONES LTD</Name>
		// 	<StartBalance>100</StartBalance>
		// 	<StartDate>2014-12-12</StartDate>
		// 	<TotalBalance>100</TotalBalance>
		// 	<Type>Communications Supplier</Type>
		// 	<TypeId>4</TypeId>
		// 	<UpdateDate>2015-09-16</UpdateDate>
		// </CreditorDetails>`;
    //
    //     function parse(xmlString): Promise<any> {
    //         return new Promise((resolve, reject) => {
    //             xml2js.parseString(xmlString, (err, result) => {
    //                 if (err) {
    //                     reject(err);
    //                 }
    //
    //                 resolve(result);
    //             });
    //         });
    //     }
    //
    //     const object = await parse(xmlStr);
    //
    //     console.log(object.CreditorDetails.AccountReference);
    //
    // });

});