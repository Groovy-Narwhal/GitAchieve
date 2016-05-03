import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';
import d3 from 'd3';

class DashBoard extends Component {
  componentDidMount() {
    UserCommitChart();
  }
  render() {
    const {
      actions
    } = this.props;
    return (
      <div>
        <h1>Dash Board</h1>
        <div id="commit-charts"></div>
      </div>
    )
  }
}

const UserCommitChart = () => {
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      barWidth = Math.floor(width / 19) - 1;

  var x = d3.scale.linear()
      .range([barWidth / 2, width - barWidth / 2]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var svg = d3.select('#commit-charts').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'commit-chart');

  var commitCounts = svg.append('g')
      .attr('class', 'commitCounts');

  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    const currentWeekCommits = data[data.length - 1]
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }
    console.log('This is the d3 json data: ', currentWeekCommits);
    var commitsMax = d3.max(currentWeekCommits.days)
    console.log(commitsMax);
    var commitCount = commitCounts.selectAll('.commitCount')
        .data(d3.range(commitsMax, 0))
      .enter().append('g')
        .attr('class', 'commitCount')
        .attr('transform', (commitCount) => (`translate(${x(commitCount)}, 0)`));
  });
};

const mapStateToProps = (state, ownProps) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
