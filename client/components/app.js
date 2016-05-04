import React, { Component } from 'react';
import Header from './header';

export default class App extends Component {
  // componentWillMount() {
  //   if (this.props.auth.authenticated) {
  //     this.props.signinUser();  
  //   }
  // }
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
}
