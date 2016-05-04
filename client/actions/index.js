import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = 'http://127.0.0.1:8000';

export function signoutUser() {
  localStorage.removeItem('token');
  return { type: types.UNAUTH_USER };
}

export function signinUser() {
  return function(dispatch) {
    // Submit email/password to the server
    axios.get(`${ROOT_URL}/github/profile`)
      .then(response => {
        // - Update state to indicate user is authenticated
        dispatch({ type: types.AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', 'MEGAN');
        // - redirect to the route '/users'
        browserHistory.push('/users');
      })
      .catch(() => {
        console.log('error');
      });
  }
};
