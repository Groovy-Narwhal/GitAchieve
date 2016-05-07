import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';

class HeaderUserButton extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="header-user-button float-right">
        <img className="user-avatar-sm" src={this.props.user.avatar_url}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(HeaderUserButton);
