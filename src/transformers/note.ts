import { XmlToObjectTransformer, ObjectToXmlTransformer, Transformer } from "./transformer";
import { Note, NoteRequest } from "../types";

export class NoteTransformer extends Transformer implements ObjectToXmlTransformer {

  item(object: NoteRequest): string {
    return `
<AddNotesRequest>
  <AssignmentID>${object.id}</AssignmentID>
  <Notes>
    ${object.notes.map(item => `
      <NoteRequest>
        <ExportedToVB>${item.export ? 'true' : 'false'}</ExportedToVB>
        <Note>${item.note}</Note>
        <ToExport>${item.export ? 'true' : 'false'}</ToExport>
      </NoteRequest>
    `).join("\n")}
  </Notes>
  <Password>${this.credentials.password}</Password>
  <Username>${this.credentials.username}</Username>
</AddNotesRequest>
    `;
  }

  items(object: Note[]): string {
    return ``;
  }

}
