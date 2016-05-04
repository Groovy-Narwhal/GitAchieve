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
    axios.get(`${ROOT_URL}/auth/github_oauth`)
      .then(response => {
        console.log('VOILAAAAAAAA', response);
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: types.AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', 'MEGAN');
        // - redirect to the route '/feature'
        browserHistory.push('/users');
      })
      .catch(() => {
        console.log('error');
        // If request is bad...
        // - Show an error to the user
        // dispatch(authError('Bad Login Info'));
      });
  }
}
    // return (dispatch) => {
    //   console.log('INSIDE SIGNIN USER')
    //   fetch(`${ROOT_URL}/auth/github_oauth`, {
    //     method: 'GET',
    //     mode: 'no-cors',
    //   })
    //   .then(response => {
    //     console.log('INSIDE FETCH RESPONSE', response);
    //     console.log('DISPATCH', dispatch)
    //     dispatch({ type: types.AUTH_USER });
    //       // If request is good...
    //       // - Update state to indicate user is authenticated
    //       // - Save the JWT token
    //       // localStorage.setItem('token', response.data.token);
    //       // - redirect to the route '/feature'
    //       // browserHistory.push('/feature');
    //     })
    //     .catch(error => {
    //       console.log('ERROR in axios post', error)
    //     })
    // }  
// }
