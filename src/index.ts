export * from "./types";

import { PartnerLinkCredentials, PartnerLinkError } from "./types";
import { CreditSearch, Submission } from "./services";

export class PartnerLink {
  private credentials: PartnerLinkCredentials;
  public creditSearch: CreditSearch;
  public submission: Submission;

  constructor(credentials: any) {
    if (credentials === undefined || credentials !instanceof PartnerLinkCredentials) { throw new PartnerLinkError('No credentials given.', 401); }
    this.credentials = credentials;
    this.boot();
  }

  private boot(): void {
    this.creditSearch = new CreditSearch(this.credentials);
    this.submission = new Submission(this.credentials);
  }

}
