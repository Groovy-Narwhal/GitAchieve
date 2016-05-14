import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class CompetitorCard extends Component {
  render() {
    return (
      <div className="competitor-card">
        <img src={this.props.competitor.avatar_url} className="user-avatar-med" />
        <h2 className="font-white">{this.props.competitor.login}</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorCard);
