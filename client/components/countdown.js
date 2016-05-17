import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

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

  update() {
    if (this.state.time === 0) {
      clearInterval(this.decrement);
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
    console.log(new Date())
    console.log(new Date("2016-05-24 20:30:52"))
    return (
      <div className="countdown-container">
        <h1>Competition Countdown</h1>
        <div className="spacer-10px"/>
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
