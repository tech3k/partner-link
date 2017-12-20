export class NoteRequest {
  public id: string;
  public notes: Note[];
}

export class Note {
  public note: string;
  public export: boolean;
}
