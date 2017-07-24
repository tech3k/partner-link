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
        e.message, //e.code === undefined ? `Unable to submit case.` : e.message,
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
  }

  public addNotes(caseInformation: CaseResult, notes: NoteRequest): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, notes: notes})
      .then(({info, notes}) => this.postRequest(
        (new NoteTransformer(this.credentials)).item(notes),
        "url",
        "api/AddNotes"
      ))
      .then(result => caseInformation);
  }

  public addCreditors(caseInformation: CaseResult, creditors: Creditor[]): Promise<CaseResult> {
    return Promise.all(
      creditors.map(item => this.addCreditor(caseInformation, item))
    ).then(results => caseInformation);
  }

  public addCreditor(caseInformation: CaseResult, creditor: Creditor): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, creditor: creditor})
      .then(({info, creditor}) => this.postRequest(
        (new CreditorTransformer(this.credentials)).item(creditor),
        "url",
        "api/AddCreditors/" + info.id
      ))
      .then(results => caseInformation)
  }

  public addDocuments(caseInformation: CaseResult, documents: Document[]): Promise<CaseResult> {
    return Promise.all(
      documents.map(item => this.addDocument(caseInformation, item))
    ).then(results => caseInformation);
  }

  public addDocument(caseInformation: CaseResult, document: Document): Promise<CaseResult> {
    return Promise.resolve({info: caseInformation, document: document})
      .then(({info, document}) => this.tokenPostRequest(
        (new DocumentTransformer).item({id: info.id, document: document} as DocumentRequest),
        "url",
        "api/AddDocument"
      ))
      .then(results => caseInformation)
  }

}
