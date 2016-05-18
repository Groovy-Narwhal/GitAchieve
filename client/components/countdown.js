import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class Countdown extends Component {
  constructor(props) {
    super(props);
    var competitionEndDate = this.props.competitorsData[0][2];
    var formattedDate = new Date(competitionEndDate);
    var time = formattedDate/1000;
    var today = new Date();
    var msDiff = formattedDate - today;
    var days = parseInt(msDiff/(24*3600*1000));
    var hours =parseInt(msDiff/(3600*1000)-(days*24));
    var mins = parseInt(msDiff/(60*1000)-(days*24*60)-(hours*60));
    var secs = parseInt(msDiff/(1000)-(mins*60)-(days*24*60*60)-(hours*60*60));
    this.state = {
      competitionEndDate: competitionEndDate,
      time: time,
      days: days,
      hours: hours,
      mins: mins,
      secs: secs
    };
  }

  componentWillUnmount() {
    clearInterval(this.decrement);
  }

  updateDB() {
    function pastCompetitions() {
      return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/pastcompetitions`)
        .then(response => {
          console.log('RES1', response.data)
          this.props.actions.pastCompetitions(response.data);
        });
    };
    function checkForFriendRequests() {
      return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/receivedmatches`)
        .then(response => {
          console.log('RES2', response.data)
          this.props.actions.receivedFriendRequests(response.data);
        });
    }
    function checkForSentRequests() {
      return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/requestedmatches`)
        .then(response => {
          console.log('RES3', response.data)
          this.props.actions.sentFriendRequests(response.data);
        });
    }
    function checkForConfirmedRequests() {
      return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/successmatches`)
        .then(response => {
          console.log('RES4', response.data)
          this.props.actions.confirmedFriendRequests(response.data);
        });
    }
    function checkForConfirmedRequests2() {
      return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/successmatches2`)
        .then(response => {
          console.log('RES5', response.data)
          this.props.actions.confirmedFriendRequests2(response.data);
        });
    }
    axios.all([pastCompetitions.apply(this), checkForFriendRequests.apply(this), checkForSentRequests.apply(this), checkForConfirmedRequests.apply(this), checkForConfirmedRequests2.apply(this)])
  }

  update() {
    if (this.state.time <= 0) {
      clearInterval(this.decrement);
      // database update users_users table
      this.updateDB.bind(this);
    }

    var newTime = this.state.time - 1; // minus one sec from initial time
    var today = new Date();
    var msDiff = new Date(this.props.competitorsData[0][2]) - today;
    var days = parseInt(msDiff/(24*3600*1000));
    var hours =parseInt(msDiff/(3600*1000)-(days*24));
    var mins = parseInt(msDiff/(60*1000)-(days*24*60)-(hours*60));
    var secs = parseInt(msDiff/(1000)-(mins*60)-(days*24*60*60)-(hours*60*60));
    this.setState({
      time: newTime,
      days: days,
      hours: hours,
      mins: mins,
      secs: secs
    });
  }

  componentDidMount() {
    this.decrement = setInterval(this.update.bind(this), 1000);
  }

  render() {
    return (
      <div className="countdown-container">
        <h1>Competition Countdown</h1>
        <div className="spacer-10px"/>
        <button onClick={this.updateDB.bind(this)}>test</button>
        <p>{this.state.days} days, {this.state.hours} hours, {this.state.mins} minutes, {this.state.secs} seconds</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
