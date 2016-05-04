import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Search extends Component {
  render() {
    return (
      <div>
        <input type="search" />
      </div>
    );
  }
}

export default Search;
