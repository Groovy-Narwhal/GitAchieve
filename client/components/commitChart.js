import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import d3 from 'd3';

class CommitChart extends Component{
  render() {
    return (
      <div>Hello</div>
    );    
  }
}

const mapStateToProps = (state, ownProps) => {
  return state;
}

export default connect(mapStateToProps)(CommitChart);