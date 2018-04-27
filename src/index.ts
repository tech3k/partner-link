import {CreditSearch, Submission} from "./services";
import {PartnerLinkCredentials, PartnerLinkError} from "./types";

export * from "./types";

export class PartnerLink {
    public creditSearch: CreditSearch;
    public submission: Submission;
    private credentials: PartnerLinkCredentials;

    constructor(credentials: any) {
        if (!credentials || credentials ! instanceof PartnerLinkCredentials) {
            throw new PartnerLinkError("No credentials given.", 401);
        }
        this.credentials = credentials;
        this.boot();
    }

    private boot(): void {
        this.creditSearch = new CreditSearch(this.credentials);
        this.submission = new Submission(this.credentials);
    }

}