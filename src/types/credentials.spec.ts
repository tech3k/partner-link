import { PartnerLinkCredentials } from './credentials';

describe('credentials', () => {
  it('debug should be false', () => {
    const cred = new PartnerLinkCredentials();
    expect(cred.debug).toBe(false);
    cred.debug = true;
    expect(cred.debug).toBe(true);
  });
});
