import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../../server/config/config-settings').CALLBACKHOST;

class ReceivedCompetitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: '',
      userid: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.primary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username,
          userid: response.data.id
        })
      });
  }

  handleAccept(e, req) {
    e.preventDefault();
    browserHistory.push(`compete/choose-second-repo/${this.state.userid}`);
  }

  render() {
    return <div className="competitor-card data-result-container">
      { !!this.state.avatar ? 
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h3 className="font-dark-gray">{this.state.username}</h3>
            <span className="font-light-gray font-size-regular">Pending...</span>
            <div className="spacer-2px" />
            <button onClick={(e) => {this.handleAccept(e, this.props.req)}} className="button block centered">Accept</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceivedCompetitorCard);
