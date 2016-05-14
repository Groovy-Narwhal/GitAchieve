import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

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
    return <div>
      { !!this.state.avatar ? 
        <div className="competitor-card">
          <img className="user-avatar-med" src={this.state.avatar} />
          <h2 className="font-white">{this.state.username}</h2>
          <span>Waiting...</span>
        </div> : <div></div> }
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
