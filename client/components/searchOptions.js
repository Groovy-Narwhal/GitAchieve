import React, { Component } from 'react';
import * as actions from './../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SearchOptions extends Component {
  
  getInitialState() {
    return {
      activeLink: 1
    }
  }

  fetchSearchUsers() {

  }

  fetchSearchRepos() {

  }

  fetchSearchOrgs() {

  }

  render() {
    <nav>
      <ul>
        {['users', 'repos', 'orgs'].map((name, index) => {
          return (
            <li key={index} onClick={this.fetchSearch.bind(this, name)}>{name}</li>
          )
        })}
      </ul>
    </nav>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
