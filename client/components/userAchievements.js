import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { cumulativeChart } from './index';
import axios from 'axios';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class UserAchievements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pullRequests: []
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/orgs/${this.props.user.id}/pullrequests`)
      .then((response) => {
        this.setState({
          pullRequests: response.data.length
        })
      })
  }

  render() {
    return (
      <div>
        <div className="text-centered data-results-container">
          <div className="spacer-10px"/>
          <h1 className="font-gray">{this.props.user.username}'s Achievements</h1>
          <img className="badge" src="../static/assets/medal.svg" alt="medal image" height="50px" width="50px" />
          <div className="spacer-10px"/>
          <div>Contributions: {this.props.userContributions}</div>
          <div>Pull Requests: {this.state.pullRequests}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAchievements);
