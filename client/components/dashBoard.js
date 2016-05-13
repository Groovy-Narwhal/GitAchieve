//@TODO: initially populate graph with logged-in user's 'contributions in last year' data

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import d3 from 'd3';
import { CommitChart } from './index';
import ghFetch from './../utils/utils';
import Repos from './repos';

class DashBoard extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    if (this.props.auth.authenticated && this.props.userContributions[0] === 0) {
      this.getUserContribs();
    }
  }
  componentDidMount() {
    var pad = 30;
    var w = 600 - 2*pad;
    var h = 360 - 2*pad;
    d3.select('svg')
      .append('text')
      .text('select a repo!')
      .attr('x', w/2)
      .attr('y', h/2)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px');
  }
  getUserContribs() {
    async function getContribs() {
      var numContribs = await ghFetch.utils.fetchLastYearGHContribs(this.props.user.username);
      this.props.actions.getUserContribs(numContribs);
    }
    getContribs.call(this);
  }
  render() {
    const { actions } = this.props;
    if (this.props.auth.authenticated) {
      return (
        <div className="dashboard">
          <h1>Your contributions: {this.props.userContributions}</h1>
          <div id="commit-charts">
            <svg width={540} height={300}>
            </svg>
          </div>
          <div><Repos /></div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
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
