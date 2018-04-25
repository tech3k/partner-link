import * as xml2js from "xml2js";

export * from "./types";
import {CreditSearch, Submission} from "./services";
import {PartnerLinkCredentials, PartnerLinkError} from "./types";

export class PartnerLink {
    public creditSearch: CreditSearch;
    public submission: Submission;
    private credentials: PartnerLinkCredentials;

    constructor(credentials: any) {
        const builder = new xml2js.Builder({headless: true, rootName: 'AddAddressesRequest'});
        process.stdout.write(builder.buildObject({
            addresses: [
                {
                    AddressDetails: {
                        AddressLine1: "",
                        AddressLine2: "",
                        Applicant: 1,
                        Country: "England",
                        County: "",
                        Notes: "",
                        Owner: "Single",
                        PTCAB: "",
                        PostCode: "",
                        SearchNumber: "",
                    },
                },
            ],
            Password: "",
            Username: "",
        }));

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

new PartnerLink(null);