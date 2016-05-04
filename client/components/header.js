import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from './../actions/index';
import { bindActionCreators } from 'redux';

class Header extends Component {
  handleSignOut() {
    // console.log(actions);
    this.props.actions.signoutUser();
    browserHistory.push('/')
  }
  renderLinks() {
    if (!this.props.authenticated) {
      return null;
    } else {
      return [
        <li key={1} onClick={() => browserHistory.push('/repos')}>
          Repos
        </li>,
        <li key={2} onClick={() => browserHistory.push('/orgs')}>
          Orgs
        </li>,
        <li key={3} onClick={this.handleSignOut.bind(this)}>
          Sign Out
        </li>
      ];
    }
  }

  render() {
    return (
      <nav>
        <h2 onClick={() => browserHistory.push('/')}>GitAchieve</h2>
        <ul>
          {this.renderLinks()}
        </ul>
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
