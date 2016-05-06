import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = 'http://127.0.0.1:8000';

export const signoutUser = () => {
  return dispatch => {
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

export const signinUser = () => {
  return dispatch => {
    // Submit email/password to the server
    axios.get(`${ROOT_URL}/github/profile`)
      .then(response => {
        console.log('RESPONES', response)
        const userProfile = {
          username: response.data.data.login,
          id: response.data.data.id,
          email: response.data.data.email,
          avatar_url: response.data.data.avatar_url
        }
        // - Update state to indicate user is authenticated
        dispatch({ type: types.AUTH_USER });
        dispatch({ type: types.UPDATE_USER, payload: userProfile });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        // - redirect to the route '/users'
        browserHistory.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
