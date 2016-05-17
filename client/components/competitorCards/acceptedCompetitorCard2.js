import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../../server/config/config-settings').CALLBACKHOST;

class AcceptedCompetitorCard2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: '',
      toggleUpdate: false
    };
  }

  componentWillUnmount() {
    clearInterval(window.interval);
  }

  competitionUpdateInterval(c) {
    clearInterval(window.interval);
    window.interval = setInterval(() => {
      console.log('primary user id2', c.primary_user_id);
      console.log('secondary_user_id2', c.secondary_user_id);
      axios.patch(`${ROOT_URL}/api/v1/users/${c.primary_user_id}/${c.secondary_user_id}/update`, {
        token: localStorage.token
      }).then(this.handleAccept.bind(this, c))
      this.setState({toggleUpdate: !this.state.toggleUpdate})
    }, 10000);
  }

  handleAccept(c) {
    console.log('hey', c.competition_end);
    var user_url = `${ROOT_URL}/api/v1/users/${c.secondary_user_id}/commits/start`;

    axios({
      method: 'get',
      url: user_url,
      headers: {
        startdate: c.competition_start,
        repoid: c.secondary_repo_id
      },
    })
    .then(response => {

      var totalCommitsForUser = response.data.reduce( (acc, cur) => acc + cur.commits.length, 0);
      var dailyUserData = response.data.map( (item) => item.commits.length);

      // get second set of data
      var comp_url = `${ROOT_URL}/api/v1/users/${this.props.c.primary_user_id}/commits/start`;

      axios({
        method: 'get',
        url: comp_url,
        headers: {
          startdate: c.competition_start,
          repoid: c.primary_repo_id
        },
      })
      .then(response => {

        var totalCommitsForComp = response.data.reduce( (acc, cur) => acc + cur.commits.length, 0);

        var user = this.props.user.username;
        var competitor = this.state.username;

        // store the cumulative data in the store
        // totalCommitsForUser andis populated in the first axios .then
        var data = [
          [user, totalCommitsForUser],
          [competitor, totalCommitsForComp]
        ];
        this.props.actions.addCompetitorData(data);

        // store the daily data in the store
        // dailyDataUser is populated in the first axios .then
        var dailyCompetitorData = response.data.map( (item) => item.commits.length);

        var dailyData = [
          [user, dailyUserData],
          [competitor, dailyCompetitorData]
        ];
        this.props.actions.addDailyCompetitorData(dailyData);

      })
    });
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

  render() {
    return <div className="competitor-card data-result-container">
      { !!this.state.avatar ? 
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h3 className="font-dark-gray">{this.state.username}</h3>
            <div className="spacer-2px"/>
            <p className="font-lighter-gray font-size-regular">Competing</p>
            <div className="spacer-2px"/>
            <button onClick={(e) => {this.handleAccept(this.props.c)}} className="button block centered">View</button>
          </div> : 
          <div className="text-centered"><img src="/static/assets/spinner.gif" /></div>}
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedCompetitorCard2);
