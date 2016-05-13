import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class ChallengesMiniView extends Component {
  compete() {
    browserHistory.push('/');
  }
  render() {
    return (
      <div className="data-results-container">
        <h2 className="font-white">My Challenges</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChallengesMiniView);
