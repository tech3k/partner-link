import { Service } from "./service";
import { CaseTransformer, CaseResultTransformer, AddAddressTransformer, NoteTransformer, CreditorTransformer, DocumentTransformer } from "../transformers";
import { PartnerLinkError, Case, CaseResult, CreditSearchAddressResult, NoteRequest, Creditor, Document, DocumentRequest } from "../types";

export class Submission extends Service {

  public createFullCase(fullCase: Case): Promise<CaseResult> {
    return Promise.resolve(fullCase)
      .then(fullCase => this.postRequest(
        (new CaseTransformer(this.credentials)).item(fullCase),
        "url",
        "api/CreateFullCaseWithReturn"
      ))
      .then(caseResult => (new CaseResultTransformer(this.credentials)).xmlItem(caseResult))
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `Unable to submit case (${e.message}).` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

  public addAddresses(caseInformation: CaseResult, addresses: CreditSearchAddressResult[]): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, addresses: addresses})
      .then(({info, addresses}) => {
        this.postRequest(
        (new AddAddressTransformer(this.credentials)).items(addresses),
        "url",
        "api/AddAddresses/" + info.id
      );
      return info;
    })
    .catch(e => { throw new PartnerLinkError(
      e.code === undefined ? `Unable to submit addresses (${e.message}).` : e.message,
      e.code === undefined ? 406 : e.code
    ) });
  }

  public addNotes(caseInformation: CaseResult, notes: NoteRequest): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, notes: notes})
      .then(({info, notes}) => this.postRequest(
        (new NoteTransformer(this.credentials)).item(notes),
        "url",
        "api/AddNotes"
      ))
      .then(result => caseInformation)
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `Unable to submit notes (${e.message}).` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

  public addCreditors(caseInformation: CaseResult, creditors: Creditor[]): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, creditors: creditors})
      .then(({info, creditors}) => this.postRequest(
        (new CreditorTransformer(this.credentials)).items(creditors),
        "url",
        "api/AddCreditors/" + info.id
      ))
      .then(results => caseInformation)
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `Unable to submit creditors (${e.message}).` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

  public addCreditor(caseInformation: CaseResult, creditor: Creditor): Promise<CaseResult> {
    return this.addCreditors(caseInformation, [creditor])
    .then(results => caseInformation)
    .catch(e => { throw new PartnerLinkError(
      e.code === undefined ? `Unable to submit creditor ${creditor.name} for ${creditor.currentBalance}.` : e.message,
      e.code === undefined ? 406 : e.code
    ) });
  }

  public addDocuments(caseInformation: CaseResult, documents: Document[]): Promise<CaseResult> {
    return Promise.all(
      documents.map(item => this.addDocument(caseInformation, item))
    ).then(results => caseInformation)
    .catch(e => { throw new PartnerLinkError(
      e.code === undefined ? `Unable to submit documents (${e.message}).` : e.message,
      e.code === undefined ? 406 : e.code
    ) });
  }

  public addDocument(caseInformation: CaseResult, document: Document): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, document: document})
      .then(({info, document}) => this.tokenPostRequest(
        (new DocumentTransformer).item({id: info.id, document: document} as DocumentRequest),
        "url",
        "api/AddDocument"
      ))
      .then(results => caseInformation)
      .catch(e => { throw new PartnerLinkError(
        e.code === undefined ? `Unable to submit document ${document.fileName}.` : e.message,
        e.code === undefined ? 406 : e.code
      ) });
  }

}
