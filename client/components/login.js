import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import * as actions from './../actions/index';
import { reduxForm } from 'redux-form';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }
  handleSignIn() {
    // console.log(this.props.actions)
    this.props.actions.signinUser()
  }
  render() {
    return (
      <div>
        <div>GitAchieve</div>
        <p>Who's on top of their code game?</p>
        <p>GitAchieve adds a competitive and fun edge to your engineering teams workflow. Visualize your git statistics against your fellow coders!</p>

        <a href='/auth/github_oauth'>Sign in with github</a>
        <button onClick={this.handleSignIn.bind(this)}>Sign in with GitHub</button>
        <div>
          <button onClick={() => browserHistory.push('/about')}>Learn about the team</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
