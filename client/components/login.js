import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

export default class Login extends Component {

  componentWillUnmount() {
    // dispatch action that sets loading to false
  }
  render() {
    return (
      <div>
        <div className="text-centered data-results-container">
          <h2 className="font-white">Are you on top of your Git game?</h2>
          <p className="font-white">GitAchieve adds a competitive and fun edge to your engineering team's workflow. See your Git statistics visualized against your fellow coders!</p>
          <a href="/auth/github_oauth"><button className="button">Sign in with GitHub</button></a>
          <button onClick={() => browserHistory.push('/about')}>Learn about the team</button>
        </div>
      </div>
    )
  }
}
