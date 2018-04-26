import * as xml2js from "xml2js";
import {
    AddAddressTransformer,
    CaseResultTransformer,
    CaseTransformer,
    CreditorTransformer,
    DocumentTransformer,
    NoteTransformer,
} from "../transformers";
import {
    Case,
    CaseResult,
    Creditor,
    CreditSearchAddressResult,
    Document,
    DocumentRequest,
    NoteRequest,
    PartnerLinkError,
} from "../types";
import {Service} from "./service";
import {OptionsV2} from "xml2js";

export class Submission extends Service {

    private options = {
        headless: true,
    } as OptionsV2; // not the correct build options

    public createFullCase(fullCase: Case): Promise<CaseResult> {
        const builder = new xml2js.Builder(this.options);

        return Promise.resolve(fullCase)
            .then((fullCase) => this.postRequest(
                builder.buildObject(new CaseTransformer(this.credentials).item(fullCase)),
                "url",
                "api/CreateFullCaseWithReturn",
            ))
            .then((caseResult) => (new CaseResultTransformer(this.credentials)).xmlItem(caseResult))
            .catch((e) => {
                throw new PartnerLinkError(
                    !e.code ? `Unable to submit case (${e.message}).` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    public addAddresses(caseInformation: CaseResult, addresses: CreditSearchAddressResult[]): Promise<CaseResult> {
        const builder = new xml2js.Builder(this.options);
        return Promise.resolve({info: caseInformation, addresses})
            .then(({info, addresses}) => {
                this.postRequest(
                    builder.buildObject(new AddAddressTransformer(this.credentials).items(addresses)),
                    "url",
                    "api/AddAddresses/" + info.id,
                );
                return info;
            })
            .catch((e) => {
                throw new PartnerLinkError(
                    !e.code ? `Unable to submit addresses (${e.message}).` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    public addNotes(caseInformation: CaseResult, notes: NoteRequest): Promise<CaseResult> {
        const builder = new xml2js.Builder(this.options);
        return Promise.resolve({info: caseInformation, notes})
            .then(({info, notes}) => this.postRequest(
                builder.buildObject(new NoteTransformer(this.credentials).item(notes)),
                "url",
                "api/AddNotes",
            ))
            .then((result) => caseInformation)
            .catch((e) => {
                throw new PartnerLinkError(
                    !e.code ? `Unable to submit notes (${e.message}).` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    public addCreditors(caseInformation: CaseResult, creditors: Creditor[]): Promise<CaseResult> {

        const builder = new xml2js.Builder(this.options);
        return Promise.resolve({info: caseInformation, creditors})
            .then(({info, creditors}) => this.postRequest(
                builder.buildObject(new CreditorTransformer(this.credentials).items(creditors)),
                "url",
                "api/AddCreditors/" + info.id,
            ))
            .then((results) => caseInformation)
            .catch((e) => {
                throw new PartnerLinkError(
                    !e.code ? `Unable to submit creditors (${e.message}).` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    public addCreditor(caseInformation: CaseResult, creditor: Creditor): Promise<CaseResult> {
        return this.addCreditors(caseInformation, [creditor])
            .then((results) => caseInformation)
            .catch((e) => {
                throw new PartnerLinkError(
                    !e.code ? `Unable to submit creditor ${creditor.name} for ${creditor.currentBalance}.` : e.message,
                    !e.code ? 406 : e.code,
                );
            });
    }

    public addDocuments(caseInformation: CaseResult, documents: Document[]): Promise<CaseResult> {

        return Promise.all(documents.map((item) => this.addDocument(caseInformation, item)))
            .then((results) => caseInformation)
            .catch((e) => {
                const err = new PartnerLinkError(
                    e.code ? `Unable to submit documents (${e.message}).` : e.message,
                    e.code ? 406 : e.code);
                err.reference = caseInformation.reference;
                throw err;
            });
    }

    public addDocument(caseInformation: CaseResult, document: Document): Promise<CaseResult> {
        const builder = new xml2js.Builder(this.options);
        return Promise.resolve({info: caseInformation, document})
            .then(({info, document}) => this.tokenPostRequest(
                builder.buildObject(new DocumentTransformer().item({id: info.id, document} as DocumentRequest)),
                "url",
                "api/AddDocument",
            ))
            .then((results) => caseInformation)
            .catch((e) => {
                if (this.credentials.debug) {
                    console.log(e);
                }

                throw new PartnerLinkError(
                    e.code === undefined ? `Unable to submit document ${document.fileName}.` : e.message,
                    e.code === undefined ? 406 : e.code,
                );
            });
    }

}
