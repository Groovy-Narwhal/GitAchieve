import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actions from './../actions/index';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import HeaderProfileButton from './headerProfileButton';
import Search from './search';

class Header extends Component {
  handleSignOut() {
    this.props.actions.signoutUser();
  }
  renderSearch() {
    if (!this.props.auth.authenticated) {
      return null;
    } else {
      if (window.location.pathname === '/') {
        return (
          <div>
          </div>
        );
      } else { /* Show search bar in header if the path is not the index */
        return (
          <div className="no-wrap">
            <Search />
          </div>
        );
      }
    }
  }
  renderProfileButton() {
    if (!this.props.auth.authenticated) {
      return null;
    } else {
      return (
        <HeaderProfileButton />
      );
    }
  }
  render() {
    return (
      <nav className="header-nav">
        <div className="header-components-container">
          <img src="./../static/assets/GitAchieveLogo-white-1-1.svg" height="50px" width="50px" onClick={() => browserHistory.push('/')} className="logo"/>
          {this.renderSearch()}
          {this.renderProfileButton()}
        </div>
      </nav>
    );
  }
}
/*
<h1 onClick={() => browserHistory.push('/')} className="logo">GitAchieve</h1>


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
