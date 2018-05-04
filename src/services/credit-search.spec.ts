import { CreditSearch } from './credit-search';
import { PartnerLinkError } from '../types';

describe('Service: Credit Search', () => {
  it('should throw error if credentials omitted', () => {
    function build() {
      new CreditSearch(undefined);
    }

    expect(build).toThrow('No credentials given.');
    expect(build).toThrow(PartnerLinkError);
  });
});
