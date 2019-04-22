import React, { Component } from 'react';

import './index.scss';

export class SearchBar extends Component {
  render() {
    return (
      <form className="form-inline container mobile">
        <input
          className="form-control mr-sm-2 item mobile"
          type="search"
          placeholder="Wyszukaj notatki..."
        />
        <button className="btn btn-light " type="submit">
          Szukaj
        </button>
      </form>
    );
  }
}

export default SearchBar;