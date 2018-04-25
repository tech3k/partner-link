import {Note, NoteRequest} from "../types";
import {ObjectToXmlTransformer, Transformer} from "./transformer";

export class NoteTransformer extends Transformer implements ObjectToXmlTransformer {

    public item(object: NoteRequest) {

        return {
            AddNotesRequest: {
                AssignmentID: object.id,
                Notes: object.notes.map((item) => {
                    return {
                        NoteRequest: {
                            ExportedToVB: item.export ? "true" : "false",
                            Note: item.note,
                            ToExport: item.export ? "true" : "false",
                        },
                    };
                }),
                Password: this.credentials.password,
                Username: this.credentials.username,
            },
        };
    }

    public items(object: Note[]) {
        return {};
    }

}
