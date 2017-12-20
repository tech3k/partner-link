import { XmlToObjectTransformer, ObjectToXmlTransformer, Transformer } from "./transformer";
import { DocumentRequest } from "../types";

export class DocumentTransformer implements ObjectToXmlTransformer {

  item(object: DocumentRequest): string {
    return `
<DocumentRequest>
  <Applicant>${object.document.applicant}</Applicant>
  <AssignmentID>${object.id}</AssignmentID>
  <Document>${object.document.encodedDocument}</Document>
  <DocumentTypeID>${object.document.typeId}</DocumentTypeID>
  <FileName>${object.document.fileName}</FileName>
</DocumentRequest>
    `;
  }

  items(object: DocumentRequest[]): string {
    return ``;
  }

}
