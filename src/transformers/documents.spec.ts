import { DocumentTransformer } from './document';
import { Document, DocumentRequest } from '../types';

describe('Docuemnts Transformer', () => {
  it('should parse documents', () => {
    const request = {
      id: '1337',
      document: {
        applicant: 2,
        encodedDocument: 'YQ==',
        typeId: 1,
        fileName: 'test.txt',
      } as Document,
    } as DocumentRequest;

    expect(new DocumentTransformer().item(request)).toEqual({
      DocumentRequest: {
        Applicant: 2,
        AssignmentID: '1337',
        Document: 'YQ==',
        DocumentTypeID: 1,
        FileName: 'test.txt',
      },
    });
  });

  it('should return an empty array', () => {
    expect(new DocumentTransformer().items([])).toEqual({});
  });
});
