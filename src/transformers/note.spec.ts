import { NoteTransformer } from './note';
import { NoteRequest, PartnerLinkCredentials } from '../types';

describe(' Note Transformer', () => {
  it('it should return fully populated note', () => {
    const note = {
      id: '1337',
      notes: [
        {
          note: 'Some text',
          export: true,
        },
      ],
    } as NoteRequest;

    expect(
      new NoteTransformer({
        username: 'root',
        password: 'password',
      } as PartnerLinkCredentials).item(note),
    ).toEqual({
      AddNotesRequest: {
        AssignmentID: '1337',
        Notes: {
          NoteRequest: [
            {
              ExportedToVB: true,
              Note: 'Some text',
              ToExport: true,
            },
          ],
        },
        Password: 'password',
        Username: 'root',
      },
    });
  });

  it('it should return to empty object', () => {
    expect(new NoteTransformer({}).items([])).toEqual({});
  });
});
