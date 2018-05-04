import { Note, NoteRequest } from '../types';
import { ObjectToXmlTransformer, Transformer } from './transformer';

export class NoteTransformer extends Transformer
  implements ObjectToXmlTransformer {
  public item(object: NoteRequest) {
    return {
      AddNotesRequest: {
        AssignmentID: object.id,
        Notes: {
          NoteRequest: object.notes.map(item => {
            return {
              ExportedToVB: item.export,
              Note: item.note,
              ToExport: item.export,
            };
          }),
        },
        Password: this.credentials.password,
        Username: this.credentials.username,
      },
    };
  }

  public items(object: Note[]) {
    return {};
  }
}
