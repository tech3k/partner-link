import { CreditSearch } from "../../services/credit-search";
import { PartnerLinkError } from "../../types";
import { expect } from "chai";
import 'mocha';

describe("Service: Credit Search", () => {
  it("should throw error if credentials omitted", () => {
      expect(() => (new CreditSearch(undefined)).checkAddress).to.throw(PartnerLinkError, "No credentials given.");
  });
});
