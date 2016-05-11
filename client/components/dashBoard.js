import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import d3 from 'd3';
import { CommitChart } from './index';
import ghFetch from './../utils/utils';

class DashBoard extends Component {

  componentDidMount() {
    // This instantiates a new d3 commit graph
    CommitChart.CommitChart();
  }
  componentDidUpdate() {
    if (this.props.auth.authenticated && this.props.userContributions[0] === 0) {
      this.getUserContribs();
    }
  }
  getUserContribs() {
    async function getContribs() {
      var numContribs = await ghFetch.utils.fetchLastYearGHContribs(this.props.user.username);
      this.props.actions.getUserContribs(numContribs);
    }
    getContribs.call(this);
  }
  render() {
    const {
      actions
    } = this.props;
    return (
      <div className="dashboard">
      <h1>Your contributions: {this.props.userContributions}</h1>
      <div id="commit-charts"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
