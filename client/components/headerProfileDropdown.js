import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import actions from './../actions/ActionCreators';

class HeaderUserButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="header-profile-dropdown">
        <div className="header-profile-dropdown-item" onClick={() => (browserHistory.push(`/${this.props.user.username}/repos`))}>profile</div>
        <div className="header-profile-dropdown-item" onClick={() => (browserHistory.push(`/${this.props.user.username}/achievements`))}>achievements</div>
        <div className="header-profile-dropdown-item" onClick={this.props.actions.unAuthUser}>signout</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUserButton);
