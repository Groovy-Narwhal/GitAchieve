import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../../server/config/config-settings').CALLBACKHOST;

class SentCompetitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username
        })
      })
  }

  render() {
    return <div className="competitor-card data-result-container">
      { !!this.state.avatar ? 
        <div>
          <img className="user-avatar-med" src={this.state.avatar} />
          <h3 className="font-dark-gray">{this.state.username.length <= 10 ? this.state.username : this.state.username.slice(0, 10) + '...'}</h3>
          <span className="font-light-gray font-size-regular">Waiting...</span>
          <div className="spacer-2px"/>
          <button className="button-inactive block centered">View</button>
        </div> :
        <div className="text-centered"><img src="/static/assets/spinner.gif" /></div> }
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SentCompetitorCard);
