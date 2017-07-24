export class DocumentRequest {
  public id: string;
  public document: Document;
}

export class Document {
  public applicant: number;
  public encodedDocument: string;
  public typeId: number;
  public fileName: string;
}
