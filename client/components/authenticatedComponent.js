import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { pushState } from 'react-router-redux';
// import { Login } from './login';

export function requireAuthentication(Component) {

  class AuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
    }

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      return (
        <Component {...this.props} />
      )
    }
  }

  const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}