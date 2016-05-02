import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = 'http://localhost:8000';

export default {
  incrementStore: num => {
    return {
      type: types.INCREMENT_SCORE,
      num
    }
  },
  addToken: token => {
    return {
      type: types.ADD_TOKEN,
      token
    }
  }
}

export function signinUser() {
  // return (dispatch) {
    
  // }
}
