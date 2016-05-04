import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = 'http://127.0.0.1:8000';

export function signoutUser() {
  return function(dispatch) {
    console.log('DISPATCH', dispatch)
    // Submit email/password to the server
    axios.get(`${ROOT_URL}/signout`)
      .then(response => {
        // - Update state to indicate user is authenticated
        dispatch({ type: types.UNAUTH_USER });
        // - Save the JWT token
        localStorage.removeItem('token');
        // - redirect to the route '/users'
        browserHistory.push('/');
      })
      .catch(() => {
        console.log('error');
      });
  }
}

export function signinUser() {
  return function(dispatch) {
    // console.log('DISPATCH', dispatch)
    // Submit email/password to the server
    axios.get(`${ROOT_URL}/github/profile`)
      .then(response => {
        // - Update state to indicate user is authenticated
        dispatch({ type: types.AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        // - redirect to the route '/users'
        browserHistory.push('/');
      })
      .catch(() => {
        console.log('error');
      });
  }
};
