import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import CompetitorCard from './competitorCard'

class CompetitorsMiniView extends Component {
  render() {
    return (
      <div className="data-results-container">
        <h2 className="font-white">My Challenges</h2>
        <CompetitorCard />
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

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorsMiniView);
