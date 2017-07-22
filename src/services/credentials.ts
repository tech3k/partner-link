import { PartnerLinkCredentials, PartnerLinkError } from "../types";

export class AcceptsCredentials {
  protected credentials: PartnerLinkCredentials;

  constructor(credentials: any) {
    if (credentials === undefined || credentials !instanceof PartnerLinkCredentials) { throw new PartnerLinkError('No credentials given.', 401) }

    this.credentials = credentials;
  }
}
