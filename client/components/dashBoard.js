//@TODO: initially populate graph with logged-in user's 'contributions in last year' data
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import actions from './../actions/ActionCreators';
import d3 from 'd3';
import utils from './../utils/utils';
import { Countdown, Repos, Search, CompetitorsMiniView, CumulativeChart, DailyChart, SentRequest, Request } from './index';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCountdown: false
    }
  }

  componentDidMount() {
    // On initial dashboard render, display text (until competitor selected)
    var svg = d3.selectAll('svg');
    if (svg) {
      svg.append('text')
        .text('select one of your competitions from My Challenges')
        .attr('x', 200)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '15px');
    }
  }
  componentDidUpdate() {
    // if (this.props.auth.authenticated && this.props.userContributions[0].contributions_past_year === 0) {
      // this.getUserContribs();
    // }
    if (this.props.competitorsData.length > 0){
      CumulativeChart(this.props.competitorsData);
    }
    if (this.props.dailyCompetitorsData.length > 0) {
      DailyChart(this.props.dailyCompetitorsData);
    }
  }
  getUserContribs() {
    // GET USER CONTRIBUTIONS FROM DATABASE INSTEAD
    // async function getContribs() {
    //   var numContribs = await utils.fetchLastYearGHContribs(this.props.user.username, this.props.user.id);
    //   this.props.actions.getUserContribs(numContribs);
    // }
    // getContribs.call(this);
  }
  makeMainChart() {
    if (this.props.competitorsData.length > 0){
      CumulativeChart(this.props.competitorsData);
    }
  }
  makeDailyChart() {
    if (this.props.dailyCompetitorsData.length > 0) {
      DailyChart(this.props.dailyCompetitorsData, 'same chart');
    }
  }
  addDailyChart() {
    if (this.props.dailyCompetitorsData.length > 0) {
      DailyChart(this.props.dailyCompetitorsData, 'additional chart');
    }
  }
  renderContributions(contribs) {
    if (!!contribs) {
      return (
        <div>
          <span className="font-white">Your public contributions: <span className="font-active">{contribs.contributions_past_year}</span> </span>
          <span className="font-white">Longest Day Streak: <span className="font-active">{contribs.longest_streak}</span> </span>
          <span className="font-white">Current Day Streak: <span className="font-active">{contribs.current_streak}</span></span>
        </div>);
    } else {
      return (<div></div>);
    }
  }

  render() {
    const { actions } = this.props;

    if (this.props.auth.authenticated) {
      return (
        <div className="dashboard">
          <div className="main-search">
            <div className="dash-header-text text-centered">
              <h1 className="logo">GitAchieve</h1>
              <div className="spacer-10px" />
              {this.renderContributions(this.props.userContributions[0])}
              <div className="spacer-10px" />
              <h1 className="font-white">Search your Git opponent</h1>
              <div className="spacer-10px" />
            </div>
            <div className="search-container text-centered">
              <div className="block text-centered">
                <Search />
              </div>
            </div>
            <div className="spacer-125px"></div>
            <CompetitorsMiniView />
          </div>
          <div className="data-results-container-clear">
            <h2 className="font-white">Achievement Charts</h2>
            <div className="data-results-container full-width">

              <div id="commit-charts">
                <div className="text-centered">
                  { this.props.competitorsData.length > 0 ? <Countdown /> : <div></div> }
                </div>
                <h3 className="font-white">Overall contributions</h3>
                <svg height={360}>
                </svg>
                <div id="second-chart">
                  <h3 className="font-white">Daily contributions</h3>
                  <svg height={360}>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
        </div>
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
