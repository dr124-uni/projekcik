import React, { Component } from 'react';
import APIService from '../../Services/APIService';
import PaymentService from '../../Services/PaymentService';
import NoteService from '../../Services/NoteService';
import HrLabel from '../HrLabel/index';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import { Card, CardContent, Typography, ListItemText } from '@material-ui/core';
import { isError } from 'util';
import SmallCard from '../UserPanel2/SmallCard';

export class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      notes: [],
      boughtNotes: [],
      loaded: false
    };
    APIService.get('api/user/me').then(user => {
      this.setState({ user }, () =>
        NoteService.getUserNotes(this.state.user.id).then(r =>
          this.setState({ notes: r, loaded: true })
        )
      );
    });
    NoteService.getBoughtNote().then(data =>
      this.setState({ boughtNotes: data })
    );
  }

  componentDidMount() {}

  handlePayout() {
    PaymentService.payout('12312412412');
  }

  render() {
    const user = this.state.user;
    const notes = this.state.notes;
    const boughtNotes = this.state.boughtNotes;
    return (
      <div className="user-panel">
        {this.state.loaded && (
          <Card className="user-data mx-auto p-3">
            <Typography
              component="h1"
              className="title mx-auto"
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom>
              {user.name}
            </Typography>
            <h2 className="text-center">
              {' '}
              <i className="fa fa-cog fa-spin" />
              Witaj <img src="http://placekitten.com/50/50" alt="photo" />{' '}
              {user.userName} w swoim panelu użytkownika!
            </h2>
            <HrLabel className="m-5" text="Podgląd informacji" />

            <div className="row m-4">
              <Grid item md={6}>
                <br />
                <ListItemText
                  className="document-what"
                  primary={[
                    <i className="fa fa-user-cog" />,
                    'Twój unikalny id użytkownika'
                  ]}
                  secondary={user.id}
                />
                <br />
                <ListItemText
                  className="document-what"
                  primary={[
                    <i className="fa fa-user" />,
                    'Imię i nazwisko użytkownika'
                  ]}
                  secondary={`${user.firstName} ${user.lastName}`}
                />
                <br />
                <ListItemText
                  className="document-what"
                  primary={[
                    <i className="fa fa-envelope" />,
                    'Twój adres e-mail'
                  ]}
                  secondary={user.emailAddress}
                />
              </Grid>
              <Grid item md={6}>
                <br />
                <ListItemText
                  className="document-what"
                  primary={[
                    <i className="fa fa-dollar-sign" />,
                    'Obecny stan konta'
                  ]}
                  secondary={user.balance}
                />
                <br />
                <ListItemText
                  className="document-what"
                  primary={[
                    <i className="fa fa-hand-holding-usd" />,
                    'A może chcesz wypłacić swoje pieniądze?'
                  ]}
                />

                <div className="btn-group p-3">
                  <Button
                    className="btn bg-success  p-3 mb-5"
                    onClick={() => this.handlePayout()}>
                    <h6>wypłać całą swoją fortunę w ilości</h6>
                    <h3>{user.balance}zł</h3>
                  </Button>
                </div>
              </Grid>
            </div>
            <HrLabel className="m-5" text="Notatki" />
            <h2 className="p-3">
              <i class="fa fa-book-reader" /> Moje notatki:{' '}
            </h2>

            {notes && notes.length && (
              <Grid
                className="grid"
                container
                spacing={8}
                direction="row"
                justify="flex-start"
                alignContent="flex-start"
                alignItems="baseline">
                {notes.map((note, i) => (
                  <Grid item sm={4} key={i} className="grid-item-note">
                    {note.noteCount <= 0 && <div className="disabled" />}
                    <SmallCard note={note} key={i} />
                  </Grid>
                ))}
              </Grid>
            )}
            <h2 className="p-3">
              <i class="fa fa-sync-alt fa-spin  " /> Historia zakupów:
            </h2>
            <i class="fa fa-spinner fa-pulse" />

            <Grid
              className="grid"
              container
              spacing={8}
              direction="row"
              justify="flex-start"
              alignContent="flex-start"
              alignItems="baseline">
              {boughtNotes.map((note, i) => (
                <Grid item sm={4} key={i} className="grid-item-note">
                  <SmallCard note={note} key={i} />
                </Grid>
              ))}
            </Grid>
          </Card>
        )}
      </div>
    );
  }
}

export default UserPanel;
