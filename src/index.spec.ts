import { PartnerLink, PartnerLinkCredentials, PartnerLinkError } from './index';
import { Service } from './services/service';
import { CreditSearch, Submission } from './services';

beforeEach(() => {
  jest
    .spyOn(Service.prototype, 'getJwt')
    .mockImplementation(() => Promise.resolve('token'));
});

describe('Partner Link Class', () => {
  it('should throw error if credentials omitted', () => {
    function build() {
      new PartnerLink(undefined);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No credentials given.');
  });

  it('credentials should be the same', () => {
    const cred = { username: 'root', password: '' } as PartnerLinkCredentials;
    const plink = new PartnerLink(cred);
    expect(plink.credentials).toBe(cred);
    expect(plink.submission).toBeInstanceOf(Submission);
    expect(plink.creditSearch).toBeInstanceOf(CreditSearch);
  });
});
