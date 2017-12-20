import { CreditSearch } from "../../services/credit-search";
import { PartnerLinkError } from "../../types";
import { expect, assert } from "chai";
import 'mocha';

describe('Service: Credit Search', () => {
  it('should throw error if credentials omitted', () => {
    assert.throws((new CreditSearch(undefined)).checkAddress, PartnerLinkError, "No credentials given.")
  });
});
