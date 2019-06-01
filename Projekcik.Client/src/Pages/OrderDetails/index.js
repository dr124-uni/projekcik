import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PaymentService from '../../Services/PaymentService';
import { Card } from '@material-ui/core';

export default class OrderDetails extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      id: 1
    };
  }

  componentWillMount() {
    PaymentService.getOrderDetails(this.props.match.params.id).then(x => {
      this.setState({
        transaction: x,
        loaded: true
      });
    });
  }

  render() {
    const { loaded, transaction } = this.state;

    if (!loaded) return <p>loading</p>;

    if (transaction.status !== 4)
      // 4 is completed payment xd
      return <p>błąd transakcji:{transaction.status}</p>;

    return (
      <Card className="p-3">
        <h4>Zakupiono notatki: </h4>
        <p>status: {transaction.status} </p>
        <p> przejdz do panelu użytkownika aby pobrać</p>
        {transaction.notes.map((x, i) => (
          <Link to={`/note/${x.id}`}>
            <p key={i}>{x.name}</p>
          </Link>
        ))}
      </Card>
    );
  }
}
