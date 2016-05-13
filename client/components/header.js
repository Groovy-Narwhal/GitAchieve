import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from './../actions/index';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Search from './search';
import HeaderProfileButton from './headerProfileButton';

class Header extends Component {
  handleSignOut() {
    this.props.actions.signoutUser();
  }
  renderLinks() {
    if (!this.props.auth.authenticated) {
      return null;
    } else {
      return [
        <Search key={0} />,
        <a key={1} onClick={() => browserHistory.push(`/${this.props.user.username}/repos`)} className="nav-link">
          Repos
        </a>,
        <a key={2} onClick={() => browserHistory.push('/orgs')} className="nav-link">
          Orgs
        </a>,
        <a key={3} onClick={this.handleSignOut.bind(this)} className="nav-link">
          SignOut
        </a>,
        <HeaderProfileButton key={4} />
      ];
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

const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Header);
