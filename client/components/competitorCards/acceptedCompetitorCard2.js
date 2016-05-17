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
      username: ''
    }
  }

  handleAccept(e, c) {
    var user_url = `${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}/commits/start`;
    console.log('user url:', user_url);

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
        console.log('comp url:', comp_url);
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

          });
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
    return <div>
      { !!this.state.avatar ?
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h2 className="font-white">{this.state.username}</h2>
            <span>Confirmed Request!</span>
            <input onClick={(e) => {this.handleAccept(e, this.props.c)}} type="button" value="COMPETE!" />
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedCompetitorCard2);
