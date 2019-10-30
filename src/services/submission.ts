import * as xml2js from 'xml2js';
import { OptionsV2 } from 'xml2js';
import {
  AddAddressTransformer,
  CaseResultTransformer,
  CaseTransformer,
  CreditorTransformer,
  DocumentTransformer,
  NoteTransformer,
} from '../transformers';
import {
  Case,
  CaseResult,
  Creditor,
  CreditSearchAddressResult,
  Document,
  DocumentRequest,
  NoteRequest,
  PartnerLinkError,
} from '../types';
import { Service } from './service';

export class Submission extends Service {

  private options = {
    headless: true,
  } as OptionsV2; // not the correct build options

  public createFullCase(fullCase: Case): Promise<CaseResult> {
    const builder = new xml2js.Builder(this.options);
    this.log('createFullCase', fullCase);

    return Promise.resolve(fullCase)
      .then(caseObj => {
        return this.postRequest(
          builder.buildObject(new CaseTransformer(this.credentials).item(caseObj)),
          'url',
          'api/CreateFullCaseWithReturn',
        );
      })
      .then(caseResult => new CaseResultTransformer(this.credentials).xmlItem(caseResult))
      .catch(e => {
        this.log('createFullCase: catch', e);

        // already been caught
        if (e instanceof PartnerLinkError) {
          throw e;
        }

        return this.parseXml(e.error)
          .then(errObj => {
            if (errObj.hasOwnProperty('string')) {
              // bad auth
              throw new PartnerLinkError(
                `Unable to submit case (${JSON.parse(errObj.string._).error_description}).`,
                406,
              );
            }

            const array = Object.keys(errObj)[0];
            const item = Object.keys(errObj[array])[1];
            const textError = errObj[array][item].map(i => {
              return i.Value[0]['d3p1:_errors'][0]['d3p1:ModelError'][0]['d3p1:_x003C_ErrorMessage_x003E_k__BackingField'][0];
            });

            // parsed error response
            throw new PartnerLinkError(`Unable to submit case (${textError.join('\n')}).`, 406);
          });
      });
  }

  public addAddresses(caseInformation: CaseResult, addresses: CreditSearchAddressResult[]): Promise<CaseResult> {
    this.log('addAddresses', caseInformation, addresses);
    const builder = new xml2js.Builder(this.options);
    return Promise.resolve({ info: caseInformation, addresses })
      .then(({ info, addresses }) => {
        return this.postRequest(
          builder.buildObject(new AddAddressTransformer(this.credentials).items(addresses)),
          'url',
          'api/AddAddresses/' + info.id,
        ).then(resp => {
          this.log('addAddresses: response', resp);
          return info;
        });
      })
      .catch(e => {
        this.log('addAddresses', e);
        throw new PartnerLinkError(
          !e.code ? `Unable to submit addresses (${e.message}).` : e.message,
          !e.code ? 406 : e.code,
        );
      });
  }

  public addNotes(caseInformation: CaseResult, notes: NoteRequest): Promise<CaseResult> {
    this.log('addNotes', caseInformation, notes);
    const builder = new xml2js.Builder(this.options);
    return Promise.resolve({ info: caseInformation, notes })
      .then(({ info, notes }) =>
        this.postRequest(
          builder.buildObject(
            new NoteTransformer(this.credentials).item(notes),
          ),
          'url',
          'api/AddNotes',
        ),
      )
      .then(result => caseInformation)
      .catch(e => {
        this.log('addNotes', e);
        throw new PartnerLinkError(
          !e.code ? `Unable to submit notes (${e.message}).` : e.message,
          !e.code ? 406 : e.code,
        );
      });
  }

  public addCreditors(caseInformation: CaseResult, creditors: Creditor[]): Promise<CaseResult> {
    this.log('addCreditors', caseInformation, creditors);

    const builder = new xml2js.Builder(this.options);
    return Promise.resolve({ info: caseInformation, creditors })
      .then(({ info, creditors }) =>
        this.postRequest(
          builder.buildObject(
            new CreditorTransformer(this.credentials).items(creditors),
          ),
          'url',
          'api/AddCreditors/' + info.id,
        ),
      )
      .then(() => caseInformation)
      .catch(e => {
        this.log('addCreditors: catch', e);
        return this.parseXml(e.error)
          .then(errObj => this.parseXml(errObj.string._))
          .then(errObj => {
            throw new PartnerLinkError(
              `Unable to submit creditors (${errObj.string._}).`,
              406,
            );
          });
      });
  }

  public addCreditor(caseInformation: CaseResult, creditor: Creditor): Promise<CaseResult> {
    this.log('addCreditor', caseInformation, creditor);
    return this.addCreditors(caseInformation, [creditor])
      .then(() => caseInformation)
      .catch(e => {
        this.log('addCreditor: catch', e);

        throw new PartnerLinkError(
          !e.code ? `Unable to submit creditor ${creditor.name} for ${creditor.currentBalance}.` : e.message,
          !e.code ? 406 : e.code,
        );
      });
  }

  public addDocuments(caseInformation: CaseResult, documents: Document[]): Promise<CaseResult> {
    this.log('addDocuments', caseInformation, documents);

    return Promise.all(
      documents.map(item => this.addDocument(caseInformation, item)),
    )
      .then(results => caseInformation)
      .catch(e => {
        this.log('addDocuments: catch', e);
        const err = new PartnerLinkError(
          !e.code ? `Unable to submit documents (${e.message}).` : e.message,
          !e.code ? 406 : e.code,
        );
        err.reference = caseInformation.reference;
        throw err;
      });
  }

  public addDocument(caseInformation: CaseResult, document: Document): Promise<CaseResult> {

    this.log('addDocument', caseInformation, document);

    const builder = new xml2js.Builder(this.options);
    return Promise.resolve({ info: caseInformation, document })
      .then(({ info, document }) => {
        return this.tokenPostRequest(
          builder.buildObject(
            new DocumentTransformer().item({
              id: info.id,
              document,
            } as DocumentRequest),
          ),
          'url',
          'api/AddDocument',
        );
      })
      .then(() => caseInformation)
      .catch(e => {
        this.log('addDocument: catch', e);

        throw new PartnerLinkError(
          !e.code ? `Unable to submit document ${document.fileName}.` : e.message,
          !e.code ? 406 : e.code,
        );
      });
  }
}
