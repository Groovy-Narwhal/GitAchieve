import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class HeaderUserButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="header-profile-dropdown">
        <div className="header-profile-dropdown-item">profile</div>
        <div className="header-profile-dropdown-item">achievements</div>
        <div className="header-profile-dropdown-item">signout</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(HeaderUserButton);
