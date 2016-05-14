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
          <div className="spacer-10px"/>
          <h1 className="font-gray">Are you on top of your Git game?</h1>
          <p className="font-gray">Add a competitive and fun edge to your engineering team's workflow. See your Git statistics visualized against your fellow coders!</p>
          <div className="spacer-20px"/>
          <a href="/auth/github_oauth"><button className="button signin">Sign in with GitHub <img src="static/assets/GitHub-Mark-Light-32px.png"/></button></a>
          <div className="spacer-10px"/>
          <button onClick={() => browserHistory.push('/about')} className="button">Learn about the team</button>
        </div>
      </div>
    )
  }
}
