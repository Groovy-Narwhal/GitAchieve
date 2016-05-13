import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from './../actions/index';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import HeaderProfileButton from './headerProfileButton';

class Header extends Component {
  handleSignOut() {
    this.props.actions.signoutUser();
  }
  renderLinks() {
    if (!this.props.auth.authenticated) {
      return null;
    } else {
      return (
        <div className="header-buttons" >
          <HeaderProfileButton />
        </div>
      );
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
/*
<a onClick={() => browserHistory.push(`/${this.props.user.username}/repos`)} className="nav-link">
  Repos
</a>
<a onClick={() => browserHistory.push('/orgs')} className="nav-link">
  Orgs
</a>
<a onClick={this.handleSignOut.bind(this)} className="nav-link">
  SignOut
</a>
*/
const mapStateToProps = state => (state)

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Header);
