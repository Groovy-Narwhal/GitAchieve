import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import CompetitorCard from './competitorCard'

class CompetitorsMiniView extends Component {
  checkIfCompetitors() {
    if (this.props.competitors.length === 0) {
      return (
        <div className="centered">
          <h2 className="font-white">Find an opponent!</h2>
        </div>
      );
    }
  }
  render() {
    return (
      <div className="data-results-container-clear">
        <h2 className="font-white">My Challenges</h2>
        <div className="data-results-container full-width">
          {this.checkIfCompetitors()}
          {this.props.competitors.map((c, i) => (<CompetitorCard competitor={c.competitor} myWeapon={c.myWeapon} key={i} />))}
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

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorsMiniView);
