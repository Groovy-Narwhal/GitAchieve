import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = 'http://localhost:8000';

export default {
  signInUser: () => {
    return (dispatch) => {
      console.log('INSIDE SIGNIN USER')
      axios.post(`${ROOT_URL}/signin/github`, { headers: { authorization: localStorage.getItem('token') } })
        .then(response => {
          console.log('INSIDE AXIOS POST');
        })
        .catch(error => {
          console.log('ERROR in axios post', error)
        })
    }
  }
}