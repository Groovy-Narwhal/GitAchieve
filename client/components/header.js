import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from './../actions/index';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Search from './search';
import HeaderUserButton from './headerUserButton';

class Header extends Component {
  handleSignOut() {
    this.props.actions.signoutUser();
  }
  renderLinks() {
    if (!this.props.authenticated) {
      return null;
    } else {
      return [
        <Search />,
        <a key={1} onClick={() => browserHistory.push('/repos')} className="nav-link">
          Repos
        </a>,
        <a key={2} onClick={() => browserHistory.push('/orgs')} className="nav-link">
          Orgs
        </a>,
        <a key={3} onClick={this.handleSignOut.bind(this)} className="nav-link">
          SignOut
        </a>,
        <HeaderUserButton />
      ];
    }
  }

  renderSearch() {
    if (!this.props.authenticated) {
      return null;
    } else {
      return <Search />;
    }
  }

  render() {
    return (
      <nav className="header-nav">
        <div className="header-components-container">
          <h2 onClick={() => browserHistory.push('/')} className="logo">GitAchieve</h2>
          {this.renderLinks()}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => (
  {
    authenticated: state.auth.authenticated
  }
)

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Header);
