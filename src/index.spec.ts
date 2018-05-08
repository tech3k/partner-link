import { PartnerLink, PartnerLinkError } from './index';

describe('Partner Link Class', () => {
  it('should throw error if credentials omitted', () => {
    function build() {
      new PartnerLink(undefined);
    }

    expect(build).toThrowError(PartnerLinkError);
    expect(build).toThrowError('No credentials given.');
  });
});
