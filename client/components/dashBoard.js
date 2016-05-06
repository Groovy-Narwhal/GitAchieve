import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';
import d3 from 'd3';
import commitChart from './commitChart';

class DashBoard extends Component {
  componentDidMount() {
    // This instantiates a new d3 commit graph
    commitChart.CommitChart();
  }

  render() {
    const {
      actions
    } = this.props;
    return (
      <div className="dashboard">
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
