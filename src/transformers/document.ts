import {
  XmlToObjectTransformer,
  ObjectToXmlTransformer,
  Transformer,
} from './transformer';
import { DocumentRequest } from '../types';

export class DocumentTransformer implements ObjectToXmlTransformer {
  public item(object: DocumentRequest) {
    return {
      DocumentRequest: {
        Applicant: object.document.applicant,
        AssignmentID: object.id,
        Document: object.document.encodedDocument,
        DocumentTypeID: object.document.typeId,
        FileName: object.document.fileName,
      },
    };
  }

  public items(object: DocumentRequest[]) {
    return {};
  }
}
