import React, { Component } from 'react';
import { Card, Typography } from '@material-ui/core';
import { Table } from 'reactstrap';
import { NoteService } from '../../Services';
import './index.scss';

export default class UserEarnings extends Component {
  constructor(props) {
    super(props);
    NoteService.getUserEarnings().then(earnings => {
      if (!earnings || earnings.length === 0) this.setState({ earnings: [] });
      this.setState({ earnings });
    });
  }

  state = {
    earnings: []
  };

  render() {
    const { earnings } = this.state;
    console.log('render');
    return (
      <Card className="p-2 m-2">
        <Typography variant="h5" className="p-2 m-2">
          Historia zarobków
        </Typography>
        <Table responsive striped bordered>
          <thead>
            <tr>
              <th>L.p.</th>
              <th>ID notatki</th>
              <th>Nazwa notatki</th>
              <th>Cena</th>
              <th>Ilość zakupów</th>
              <th>Całkowity zysk</th>
            </tr>
          </thead>
          <tbody>
            {earnings &&
              earnings.map((earning, idx) => (
                <tr key={idx}>
                  <th scope="row">{idx + 1}.</th>
                  <td>{earning.id}</td>
                  <td>{earning.name}</td>
                  <td>{earning.price} zł</td>
                  <td>{earning.purchases}</td>
                  <td>{earning.profit} zł</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    );
  }
}