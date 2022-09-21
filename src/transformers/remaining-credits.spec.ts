import {
  RemainingCreditsResultTransformer,
  RemainingCreditsTransformer,
} from './remaining-credits';

const testCredentials = {
  creditSearchClient: 'test-client',
  creditSearchUsername: 'test-username',
  creditSearchPassword: 'test-password',
};

describe('RemainingCreditsTransformer', () => {
  it('should transform item', () => {
    expect(new RemainingCreditsTransformer(testCredentials).item())
      .toEqual(`<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetLightSearchCreditsLeft xmlns="http://searchlink.co.uk/">
          <cred>
            <Client>${testCredentials.creditSearchClient}</Client>
            <UserName>${testCredentials.creditSearchUsername}</UserName>
            <Password>${testCredentials.creditSearchPassword}</Password>
          </cred>
        </GetLightSearchCreditsLeft>
      </soap:Body>
    </soap:Envelope>`);
  });
});

describe('RemainingCreditsResultTransformer', () => {
  it('should transform xml item', async () => {
    const result = await new RemainingCreditsResultTransformer(
      testCredentials,
    ).xmlItem(
      `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><GetLightSearchCreditsLeftResponse xmlns="http://searchlink.co.uk/"><GetLightSearchCreditsLeftResult>1</GetLightSearchCreditsLeftResult></GetLightSearchCreditsLeftResponse></soap:Body></soap:Envelope>`,
    );
    expect(result).toBe('1');
  });
});
