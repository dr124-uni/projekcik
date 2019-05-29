import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Paper } from '@material-ui/core';
import { ShowNoteButton, AddToCartButton } from '../Buttons';
import './index.scss';

export default class SmallNoteCard extends React.Component {
  render() {
    const { note } = this.props;

    return (
      <Paper className="small-note-card note-card p-2 m-2">
        <div className="note-name">
          <Link to={`/note/${note.id}`} style={{ textDecoration: 'none' }}>
            <h5>{note.name}</h5>
          </Link>
        </div>
        <div className="note-small-info">
          <dl>
            <Typography>Województwo: {note.voivodeship.name}</Typography>
            <Typography />
            <Typography>Uczelnia: {note.university.name}</Typography>
            <Typography />
            <Typography>
              Kierunek: {note.course.name}, sem. {note.semester}
            </Typography>
            <Typography />
          </dl>
        </div>
        <div className="btn-small-group">
          <ShowNoteButton id={note.id} />
          <AddToCartButton
            className="btn cart btn-md rounded-left rounded-right"
            price={note.price}
            id={note.id}
          />
        </div>
      </Paper>
    );
  }
}
