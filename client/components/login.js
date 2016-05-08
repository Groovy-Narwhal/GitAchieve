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
        <p>Who's on top of their code game?</p>
        <p>GitAchieve adds a competitive and fun edge to your engineering teams workflow. Visualize your git statistics against your fellow coders!</p>
        <a href="/auth/github_oauth">Sign in with GitHub</a>
        <button onClick={() => browserHistory.push('/about')}>Learn about the team</button>
      </div>
    )
  }
}
