import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Organizations extends Component {
  componentWillMount() {
    fetch(`https://api.github.com/user/orgs`)
      .then(res => res.json())
      .then(res => console.log(res))
  }
  render() {
    return (
      <div>
        <img src={this.props.user.avatar_url} className="user-avatar-1"/>
        <h2>{this.props.user.username}</h2>
        <h4>My Organizations</h4>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations);
