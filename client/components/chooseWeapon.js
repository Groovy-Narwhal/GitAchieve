import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import actions from './../actions/ActionCreators';
import Repos from './repos';
import axios from 'axios';

require('react-datepicker/dist/react-datepicker.css');

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class ChooseWeapon extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().subtract(7, 'days')
    };
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  compete() {
    browserHistory.push('/');
    this.props.actions.addCompetitor({competitor: this.props.chosenSearchResult, myWeapon: this.props.chosenWeapons});
    const primaryRID = this.props.chosenWeapons.id;
    this.props.actions.chooseSearchResult({});
    this.props.actions.chooseWeapon({});
    var competitionData = {
      primary_user_id: this.props.user.id,
      secondary_user_id: this.props.chosenSearchResult.id,
      secondaryUsername: this.props.chosenSearchResult.login,
      primary_repo_id: primaryRID,
      competition_start: this.state.startDate._d
    };
    console.log(this.props.user.username);
    // this will add opponent user to database if they don't already exist
    axios.patch(`${ROOT_URL}/api/v1/users/${competitionData.secondary_user_id}`, {
      username: this.props.user.username,
      competitorUsername: competitionData.secondaryUsername
    })
    // this will add an entry to the users_users table
    .then((res) => {
      console.log('RES', res);
      axios.post(`${ROOT_URL}/api/v1/users/${competitionData.primary_user_id}/friends`, {
        secondaryUserId: res.data.id,
        secondaryUsername: res.data.uesername,
        secondaryUserEmail: res.data.email,
        primaryRepoId: competitionData.primary_repo_id,
        competitionStart: competitionData.competition_start
      })
      .then(response => {
        console.log('RESPONSE', response)
        axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/requestedmatches`)
        .then((res) => {
           this.props.actions.sentFriendRequests(res.data);
        })
      })
      .then(() => {
        // connect to socket
        const socket = io.connect(window.location.origin);
        socket.emit('Compete Request', {
          user1: this.props.user.username,
          user2: competitionData.secondaryUsername
        });
      })
      .then(() => {
        axios.get(`${ROOT_URL}/send-email?user=${this.props.user.username}&competitor=${competitionData.secondaryUsername}&competitor_id=${competitionData.secondary_user_id}`)
      })
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    return (
      <div className="data-results-container-clear">
        <h2>Choose Your Weapon // Repos</h2>
        <Repos />
        <h2>Pick a start Date</h2>
        <div className="data-results-container-flex full-width">
          <DatePicker
            maxDate={moment()}
            selected={this.state.startDate}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className="spacer-10px"></div>
        <div className="block text-centered">
          <input type="submit" value="COMPETE" className="button compete" onClick={this.compete.bind(this)} />
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ChooseWeapon);
