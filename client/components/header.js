import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {
  renderLinks() {

    if (!this.props.authenticated) {
      return <li>
        <Link to="/signin">Sign In</Link>
      </li>
    } else {
      return [
        <li key={1}>
          <Link to="/repos">Repos</Link>
        </li>,
        <li key={2}>
          <Link to="/orgs">Organizations</Link>
        </li>,
        <li key={3}>
          <Link to="/signout">Sign Out</Link>
        </li>
      ];
    }
  }

  render() {
    return (
      <nav>
        <Link to="/">GitAchieve</Link>
        <ul>
          {this.renderLinks()}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  console.log('STATEAUTH', state.auth.authenticated);
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
