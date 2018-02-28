import { expect } from "chai";
import "mocha";
import { CreditSearch } from "../../services";
import { PartnerLinkError } from "../../types";

describe("Service: Credit Search", () => {
  it("should throw error if credentials omitted", () => {
      expect(() => (new CreditSearch(undefined)).checkAddress).to.throw(PartnerLinkError, "No credentials given.");
  });
});
