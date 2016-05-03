import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';
import $ from 'jquery';

const ROOT_URL = 'http://127.0.0.1:8000';
export function signinUser() {
    return (dispatch) => {
      console.log('INSIDE SIGNIN USER')
      fetch(`${ROOT_URL}/auth/github_oauth`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
          // 'responseType': 'json',
          // 'authorization': 'bXNtaXRoOTM5MzpGaWxpcHBpbmkqNjA'
        }
      })
        // .then(response => {
        //   return response.json();
        // })
        .then(response => {
          console.log('INSIDE FETCH RESPONSE', response);

          // If request is good...
          // - Update state to indicate user is authenticated
          dispatch({ type: types.AUTH_USER });
          // - Save the JWT token
          // localStorage.setItem('token', response.data.token);
          // - redirect to the route '/feature'
          // browserHistory.push('/feature');
        })
        .catch(error => {
          console.log('ERROR in axios post', error)
        })
    }
  
}

// export function signinUser() {
//   return function(dispatch) {
//     // Submit email/password to the server
//     $.get(`${ROOT_URL}/auth/github_oauth`, function() {
//       console.log('WOOOOO')

//     })
//   }
// }
  //     .then(response => {
  //       console.log(response)
  //       dispatch({ type: types.AUTH_USER });
  //       // - Save the JWT token
  //       // localStorage.setItem('token', response.data.token);
  //       // - redirect to the route '/users'
  //       browserHistory.push('/users');
  //     })
  //     .catch((err) => {
  //       console.log('ERROR', err);
  //       // If request is bad...
  //       // - Show an error to the user
  //       // dispatch(authError('Bad Login Info'));
  //     });
  // }
// }