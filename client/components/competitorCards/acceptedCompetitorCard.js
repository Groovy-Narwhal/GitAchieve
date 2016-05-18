/* NOTE: The only places that this card's handleAccept function is different:
  1 - user_url and competitor_url switch out primary vs. secondary user id
  2 - axios calls 1 & 2 also switch those up in the header
  that's it!
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../../server/config/config-settings').CALLBACKHOST;

class AcceptedCompetitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: '',
      toggleUpdate: false
    };
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username,
          userid: response.data.id
        });
      });
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
      });
      this.setState({toggleUpdate: !this.state.toggleUpdate});
    }, 10000);
  }

  handleAccept(c) {
    /* handleAccept uses data from the competitor clicked as this.props.c, which has
      - both repo ids
      - both user ids
      - competition start date

      This information is stored in users_users, the competitions table.
      For now at least, repo name info is not stored in users_users.
      This function makes two calls to /users/:id/commits/start to grab commit
      info, one per user, and similarly two calls to grab just the repo name.

      Four axios calls, so buckle up. (May be refactored with axios.all)
    */
    var user = this.props.user.username;
    var competitor = this.state.username;
    var user_url = `${ROOT_URL}/api/v1/users/${c.primary_user_id}/commits/start`;
    var comp_url = `${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}/commits/start`;

    var userRepo, competitorRepo;
    var data, totalCommitsForUser, totalCommitsForComp;
    var dailyData, dailyUserData, dailyCompetitorData;

    axios({
      method: 'get',
      url: user_url,
      headers: {
        startdate: c.competition_start,
        repoid: c.primary_repo_id
      },
    })
    .then(response => {

      // update commit data for one user
      totalCommitsForUser = response.data.reduce( (acc, cur) => acc + cur.commits.length, 0);
      dailyUserData = response.data.map( (item) => item.commits.length);

      // get second set of data
      axios({
        method: 'get',
        url: comp_url,
        headers: {
          startdate: c.competition_start,
          repoid: c.secondary_repo_id
        },
      })
        .then(response => {

          // update commit data for other user
          totalCommitsForComp = response.data.reduce( (acc, cur) => acc + cur.commits.length, 0);
          dailyCompetitorData = response.data.map( (item) => item.commits.length);

          // update the cumulative data and the daily data
          // the repo name data will be added after the next two axios.get's
          data = [
            [], // add the repo names after getting them
            [user, totalCommitsForUser],
            [competitor, totalCommitsForComp]
          ];
          dailyData = [
            [],
            [user, dailyUserData],
            [competitor, dailyCompetitorData]
          ];

          // get repo name for one user's repo
          axios({
            method: 'get',
            url: `/api/v1/users/${c.primary_user_id}/repo`,
            headers: {
              repoid: c.primary_repo_id
            },
          })

          .then(response => {

            userRepo = response.data[0] ? response.data[0].name : 'repo name not found';

            // get repo name for other user's repo

            axios({
              method: 'get',
              url: `/api/v1/users/${c.secondary_user_id}/repo`,
              headers: {
                repoid: c.secondary_repo_id
              },
            })

            .then(response => {

              competitorRepo = response.data[0] ? response.data[0].name : 'repo name not found';

              //update cumulative and daily data with repo names
              data[0].push(userRepo);
              data[0].push(competitorRepo);
              dailyData[0].push(userRepo);
              dailyData[0].push(competitorRepo);

              // FINAL STEP: Now we have all the data, update the store,
              // which will trigger (in Dashboard component) graph draws
              this.props.actions.addCompetitorData(data);
              this.props.actions.addDailyCompetitorData(dailyData);
            });
          });

        });
    });
  }

  render() {
    return <div className="competitor-card data-result-container">
      { !!this.state.avatar ?
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h3 className="font-dark-gray">{this.state.username}</h3>
            <div className="spacer-2px" />
            <p className="font-lighter-gray font-size-regular">Competing</p>
            <div className="spacer-2px"/>
            <button onClick={(e) => {this.handleAccept(this.props.c)}} className="button block centered">View</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedCompetitorCard);
