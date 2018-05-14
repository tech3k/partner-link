import { PartnerLinkError } from './error';

describe('PartnerLinkError', () => {
  it('should check set reference is set', () => {
    const error = new PartnerLinkError('msg', 40);
    expect(error.reference).toBeUndefined();
    error.setReference('ref');
    expect(error.getReference()).toEqual('ref');
  });
});
