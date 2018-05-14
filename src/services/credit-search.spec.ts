import { CreditSearch } from './credit-search';
import {
  Creditor,
  CreditSearchAddress,
  CreditSearchAddressResult,
  CreditSearchPerson,
  CreditSearchPersonResult,
  PartnerLinkCredentials,
  PartnerLinkError,
} from '../types';
import * as moment from 'moment';

beforeEach(() => {
  jest
    .spyOn(CreditSearch.prototype, 'getJwt')
    .mockImplementation(async () => await 'auth-token');
});

describe('CreditSearch: checkAddress', () => {
  it('should throw error if credentials omitted', () => {
    function build() {
      new CreditSearch(undefined);
    }

    // mock is working
    expect(build).toThrow('No credentials given.');
    expect(build).toThrow(PartnerLinkError);
  });

  it('should return credit search adress results', async () => {
    jest.spyOn(CreditSearch.prototype, 'soapRequest').mockImplementation(
      async () =>
        await `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope/" soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
    <soap:Body>
        <SearchAddressResponse>
            <SearchAddressResult>
                &lt;Address&gt;&lt;AddressMatch ptcabs="58150008380" HouseNumber="12" Street1="High St" Street2=""
                Town="Westbury" PostCode="M1 6NG"/&gt;&lt;/Address&gt;
            </SearchAddressResult>
        </SearchAddressResponse>
    </soap:Body>
</soap:Envelope>`,
    );

    const data = {
      houseNumber: '12',
      postalCode: 'M1 6NG',
      street: 'High St',
      town: 'Westbury',
      surname: 'Smith',
    } as CreditSearchAddress;

    const service = new CreditSearch({} as PartnerLinkCredentials);

    expect(await service.checkAddress(data)).toEqual([
      {
        id: '58150008380',
        address1: '12',
        address2: 'High St',
        address3: '',
        town: 'Westbury',
        postalCode: 'M1 6NG',
      } as CreditSearchAddressResult,
    ]);
  });

  it('should throw exception, address was not found', () => {
    jest.spyOn(CreditSearch.prototype, 'soapRequest').mockImplementation(
      async () =>
        await `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope/" soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
    <soap:Body>
        <SearchAddressResponse>
            <SearchAddressResult>&lt;Address/&gt;</SearchAddressResult>
        </SearchAddressResponse>
    </soap:Body>
</soap:Envelope>`,
    );

    const data = {
      houseNumber: '12',
      postalCode: 'M1 6NG',
      street: 'High St',
      town: 'Westbury',
      surname: 'Smith',
    } as CreditSearchAddress;
    const service = new CreditSearch({} as PartnerLinkCredentials);

    expect(service.checkAddress(data)).rejects.toThrowError(PartnerLinkError);
    expect(service.checkAddress(data)).rejects.toThrowError(
      'Address 12, M1 6NG was not found.',
    );
  });
});

describe('CreditSearch: checkMultipleAddresses', () => {
  it('should throw error when checking multiple addresses', () => {
    const service = new CreditSearch({} as PartnerLinkCredentials);
    const data: CreditSearchAddress[] = [
      {} as CreditSearchAddress,
      {} as CreditSearchAddress,
      {} as CreditSearchAddress,
      {} as CreditSearchAddress,
    ];
    expect(service.checkMultipleAddresses(data)).rejects.toThrowError(
      PartnerLinkError,
    );
    expect(service.checkMultipleAddresses(data)).rejects.toThrowError(
      'No more than 3 addresses can be credit searched.',
    );
  });

  it('should return multiple addresses with success', async () => {
    jest.spyOn(CreditSearch.prototype, 'soapRequest').mockImplementation(
      async () =>
        await `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope/" soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
    <soap:Body>
        <SearchAddressResponse>
            <SearchAddressResult>
                &lt;Address&gt;&lt;AddressMatch ptcabs="58150008380" HouseNumber="12" Street1="High St" Street2="" Town="Westbury" PostCode="M1 6NG"/&gt;&lt;/Address&gt;
                &lt;Address&gt;&lt;AddressMatch ptcabs="58150008380" HouseNumber="12" Street1="High St" Street2="" Town="Westbury" PostCode="M1 6NG"/&gt;&lt;/Address&gt;
            </SearchAddressResult>
        </SearchAddressResponse>
    </soap:Body>
</soap:Envelope>`,
    );
    const service = new CreditSearch({} as PartnerLinkCredentials);
    const data: CreditSearchAddress[] = [
      {
        houseNumber: '12',
        postalCode: 'M1 6NG',
        street: 'High St',
        town: 'Westbury',
        surname: 'Smith',
      } as CreditSearchAddress,
      {
        houseNumber: '12',
        postalCode: 'M1 6NG',
        street: 'High St',
        town: 'Westbury',
        surname: 'Smith',
      } as CreditSearchAddress,
    ];

    expect(await service.checkMultipleAddresses(data)).toEqual([
      [
        {
          id: '58150008380',
          address1: '12',
          address2: 'High St',
          address3: '',
          town: 'Westbury',
          postalCode: 'M1 6NG',
        },
      ],
      [
        {
          id: '58150008380',
          address1: '12',
          address2: 'High St',
          address3: '',
          town: 'Westbury',
          postalCode: 'M1 6NG',
        },
      ],
    ]);
  });
});

describe('CreditSearch: performCreditCheck', () => {
  it('should perform credit check', async () => {
    jest
      .spyOn(CreditSearch.prototype, 'soapRequest')
      .mockImplementationOnce(async () => {
        return await `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <GetLightSearchAccountDataWithCreditSearchIDResponse xmlns="http://searchlink.co.uk/">
        <GetLightSearchAccountDataWithCreditSearchIDResult>&lt;Account ID="451912"
            ClientReference="6bc165eedfa88fe5853403ac" Title="Mr" FirstName="John" Surname="Smith"
            DateOfBirth="1979-06-15T00:00:00"&gt;&lt;AccountData CreditorName="PRAC FINANCIAL LIMITED"
            CreditorType="DEBT COLLECTOR" AccountReference="N/A" AccountType="PAY DAY LOANS" JointAccount="0"
            StartBalance="£688" DelinquentBalance="£688" CurrentBalance="£0" CreditStartDate="2014-05-02T00:00:00"
            CreditUpdateDate="2017-03-20T00:00:00" CreditEndDate="2014-09-25T00:00:00" CreditAmount=""
            CreditTerms="MONTHLY" LatestStatus="S" /&gt;&lt;AccountData CreditorName="BARCLAYCARD CENTRE"
            CreditorType="CREDIT CARD" AccountReference="N/A" AccountType="CREDIT / STORE CARD" JointAccount="0"
            StartBalance="£0" DelinquentBalance="£0" CurrentBalance="£1,760" CreditStartDate="2013-07-17T00:00:00"
            CreditUpdateDate="2018-04-16T00:00:00" CreditAmount="£1,800" CreditTerms="MONTHLY" LatestStatus="0" /&gt;
            &lt;/Account&gt;
        </GetLightSearchAccountDataWithCreditSearchIDResult>
        <creditSearchID>451912</creditSearchID>
    </GetLightSearchAccountDataWithCreditSearchIDResponse>
</soap:Body>
</soap:Envelope>`;
      })
      .mockImplementation(async () => {
        return await `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <GetLightSearchCreditReportHTMLResponse xmlns="http://searchlink.co.uk/">
        <GetLightSearchCreditReportHTMLResult>YQ==</GetLightSearchCreditReportHTMLResult>
    </GetLightSearchCreditReportHTMLResponse>
</soap:Body>
</soap:Envelope>`;
      });
    const data = {
      clientReference: 'ref-00001',
      title: 'Mr',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: moment('1990-01-01'),
      addresses: [{} as CreditSearchAddressResult],
    } as CreditSearchPerson;

    function buildExpected(): CreditSearchPersonResult {
      const cred1 = new Creditor();
      const cred2 = new Creditor();

      cred1.name = 'PRAC FINANCIAL LIMITED';
      cred1.creditorType = 'DEBT COLLECTOR';
      cred1.reference = 'N/A';
      cred1.accountType = 'PAY DAY LOANS';
      cred1.jointAccount = false;
      cred1.startBalance = 68800;
      cred1.delinquentBalance = 68800;
      cred1.currentBalance = 0;
      cred1.creditStartDate = moment('2014-05-02T00:00:00');
      cred1.creditUpdateDate = moment('2017-03-20T00:00:00');
      cred1.creditAmount = null;
      cred1.creditTerms = 'MONTHLY';
      cred1.latestStatus = 'S';
      cred2.name = 'BARCLAYCARD CENTRE';
      cred2.creditorType = 'CREDIT CARD';
      cred2.reference = 'N/A';
      cred2.accountType = 'CREDIT / STORE CARD';
      cred2.jointAccount = false;
      cred2.startBalance = 0;
      cred2.delinquentBalance = 0;
      cred2.currentBalance = 176000;
      cred2.creditStartDate = moment('2013-07-17T00:00:00');
      cred2.creditUpdateDate = moment('2018-04-16T00:00:00');
      cred2.creditAmount = 180000;
      cred2.creditTerms = 'MONTHLY';
      cred2.latestStatus = '0';

      const resp = new CreditSearchPersonResult();
      resp.creditors = [cred1, cred2];
      resp.id = 451912;
      resp.report = 'a';
      return resp;
    }

    const service = new CreditSearch({} as PartnerLinkCredentials);
    const result = await service.performCreditCheck(data);

    expect(result).toEqual(buildExpected());
  });

  it('should return zero creditors', async () => {
    jest
      .spyOn(CreditSearch.prototype, 'soapRequest')
      .mockImplementationOnce(async () => {
        return await `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <GetLightSearchAccountDataWithCreditSearchIDResponse xmlns="http://searchlink.co.uk/">
        <GetLightSearchAccountDataWithCreditSearchIDResult>&lt;Account ID="451912"
            ClientReference="6bc165eedfa88fe5853403ac" Title="Mr" FirstName="John" Surname="Smith"
            DateOfBirth="1979-06-15T00:00:00"&gt;&lt;/Account&gt;
        </GetLightSearchAccountDataWithCreditSearchIDResult>
        <creditSearchID>451912</creditSearchID>
    </GetLightSearchAccountDataWithCreditSearchIDResponse>
</soap:Body>
</soap:Envelope>`;
      })
      .mockImplementation(async () => {
        return await `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <GetLightSearchCreditReportHTMLResponse xmlns="http://searchlink.co.uk/">
        <GetLightSearchCreditReportHTMLResult></GetLightSearchCreditReportHTMLResult>
    </GetLightSearchCreditReportHTMLResponse>
</soap:Body>
</soap:Envelope>`;
      });
    const data = {
      clientReference: 'ref-00001',
      title: 'Mr',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: moment('1990-01-01'),
      addresses: [{} as CreditSearchAddressResult],
    } as CreditSearchPerson;

    const service = new CreditSearch({} as PartnerLinkCredentials);
    const resp = new CreditSearchPersonResult();
    resp.id = 451912;
    resp.creditors = [];
    resp.report = '';
    expect(await service.performCreditCheck(data)).toEqual(resp);
  });

  it('should throw error', async () => {
    jest
      .spyOn(CreditSearch.prototype, 'soapRequest')
      .mockImplementation(async () => {
        throw new Error('Whoops');
      });

    const service = new CreditSearch({} as PartnerLinkCredentials);

    function build() {
      return service.performCreditCheck({
        dateOfBirth: moment(),
        addresses: [{} as CreditSearchAddressResult],
      } as CreditSearchPerson);
    }

    expect(build()).rejects.toThrowError(PartnerLinkError);
    expect(build()).rejects.toThrowError('Unable to preform credit search.');
  });
});
