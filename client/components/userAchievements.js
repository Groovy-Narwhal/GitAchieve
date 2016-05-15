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
          pullRequests: response.data
        })
      })
  }

  render() {
    return (
      <div className="achievements">
        <div>Achievements</div>
        <img src="../static/assets/medal.svg" alt="medal image" height="50px" width="50px" />
        <div>Pull Requests</div>
        {this.state.pullRequests.map((pr, ind) => {
          console.log(pr);
          return <div>Hello</div>
        })}
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
