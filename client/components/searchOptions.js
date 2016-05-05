import React, { Component } from 'react';
import * as actions from './../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SearchOptions extends Component {

  fetchSearchUsers() {

  }

  fetchSearchRepos() {

  }

  fetchSearchOrgs() {

  }

  render() {
    <nav>
      <li onClick={this.fetchSearchUsers.bind(this)}>Users</li>
      <li onClick={this.fetchSearchRepos.bind(this)}>Repos</li>
      <li onClick={this.fetchSearchOrgs.bind(this)}>Orgs</li>
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
