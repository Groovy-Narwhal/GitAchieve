import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'react-router-redux';
import { Login } from './login';

export function requireAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {
    
    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.isAuthenticated) {
        let redirectAfterLogin = this.props.location.pathname;
        console.log('redirectAfterLogin', redirectAfterLogin);
        this.props.dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
      }
    }

    render() {
      return (
        <div>
          { this.props.isAuthenticated === true
            ? <Component {...this.props} />
            : <Login />
          }
        </div>
      )
    }
  }

  const mapStateToProps = (state) => ({
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}