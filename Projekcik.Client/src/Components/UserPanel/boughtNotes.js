import React, { Component } from 'react';
import { NoteService } from '../../Services';
import { Grid } from '@material-ui/core';
import { WideSmallNoteCard, DownloadNoteCard } from '../NoteCards';

export default class BoughtNotes extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      notes: []
    };

    NoteService.getBoughtNotes().then(x => {
      this.setState({
        notes: x || [],
        loaded: true
      });
    });
  }
  render() {
    const { notes, loaded } = this.state;

    return (
      <div>
        {' '}
        <h2 className="p-3">
          <i className="fa fa-book-reader" /> Moje notatki
        </h2>
        <Grid
          className="grid"
          container
          spacing={8}
          direction="row"
          justify="flex-start"
          alignContent="flex-start"
          alignItems="baseline ">
          {notes.map((note, i) => (
            <Grid item sm={4} key={i} className="grid-item-note">
              {note.noteCount <= 0 && <div className="disabled" />}
              <DownloadNoteCard note={note} key={i} />
            </Grid>
          ))}
          {notes.length ? '' : 'brak kupionych notatek'}
        </Grid>
      </div>
    );
  }
}
