import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

class Organizations extends Component {

  componentWillMount() {
    console.log('hola senorita')
    axios.get(`${ROOT_URL}/github/${this.props.user.username}/orgs`)
      .then(response => {
        console.log('YOU KNOW', response);
      })
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
