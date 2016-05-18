import axios from 'axios';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

export const signoutUser = () => {
  return dispatch => {
    // - Update state to indicate user is not authenticated
    dispatch({ type: types.UNAUTH_USER });
    return axios.get(`${ROOT_URL}/signout`)
      .then(response => {
        // - Remove token
        localStorage.removeItem('token');
        // - redirect to the route '/users'
        browserHistory.push('/');
      })
      .catch((err) => {
        console.log('error', err);
      });
  }
}

const checkForFriendRequests = (id, dispatch) => {
  return axios.get(`${ROOT_URL}/api/v1/users/${id}/receivedmatches`)
    .then(response => {
      console.log('Received requests not accepted', response.data);
      if (response.data.length > 0) {
        dispatch({
          type: types.YES_COMPETITIONS
        })
      }
      dispatch({
        type: types.RECEIVED_FR,
        receivedRequests: response.data
      });
    });
};

const checkForSentRequests = (id, dispatch) => {
  return axios.get(`${ROOT_URL}/api/v1/users/${id}/requestedmatches`)
    .then(response => {
      console.log('Sent requests not accetped', response.data);
      if (response.data.length > 0) {
        dispatch({
          type: types.YES_COMPETITIONS
        })
      }
      dispatch({
        type: types.SENT_FR,
        sentRequests: response.data
      });
    });
};

const checkForConfirmedRequests = (id, dispatch) => {
  return axios.get(`${ROOT_URL}/api/v1/users/${id}/successmatches`)
    .then(response => {
      console.log('confirmed request in which logged in user sent the request', response.data);
      if (response.data.length > 0) {
        dispatch({
          type: types.YES_COMPETITIONS
        })
      }
      dispatch({
        type: types.CONFIRMED_FR,
        confirmedRequests: response.data
      });
    });
};

const checkForConfirmedRequests2 = (id, dispatch) => {
  return axios.get(`${ROOT_URL}/api/v1/users/${id}/successmatches2`)
    .then(response => {
      console.log('confirmed request in which logged in received the request', response.data);
      if (response.data.length > 0) {
        dispatch({
          type: types.YES_COMPETITIONS
        })
      }
      dispatch({
        type: types.CONFIRMED_FR2,
        confirmedRequests2: response.data
      });
    });
};

const checkForPastCompetitions = (id, dispatch) => {
  return axios.get(`${ROOT_URL}/api/v1/users/${id}/pastcompetitions`)
    .then(response => {
      console.log('past Competitions', response.data);
      dispatch({
        type: types.PAST_COMPETITIONS,
        pastCompetitions: response.data
      });
    });
};

export const signinUser = () => {
  return dispatch => {
    // - Update state to indicate user is authenticated
    dispatch({ type: types.AUTH_USER });
    return axios.get(`${ROOT_URL}/github/profile`)
      .then(response => {
        const userProfile = {
          username: response.data.data.login,
          id: response.data.data.id,
          email: response.data.data.email,
          avatar_url: response.data.data.avatar_url
        }
        dispatch({ type: types.UPDATE_USER, payload: userProfile });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);

        // connect to socket
        const socket = io.connect(window.location.origin);
        // join room 
        socket.emit('join', userProfile);
        // listen for incoming messages
        socket.on('incoming_request', msg => {
          console.log(msg.msg);
          checkForFriendRequests(userProfile.id, dispatch);
          checkForSentRequests(userProfile.id, dispatch);
          checkForConfirmedRequests(userProfile.id, dispatch);
          checkForConfirmedRequests2(userProfile.id, dispatch);
          checkForPastCompetitions(userProfile.id, dispatch);
        });

        // - redirect to the route '/'
        browserHistory.push('/');
        return userProfile.id;
      })
      .then((id) => {
        checkForPastCompetitions(id, dispatch);
        return id;
      })
      .then((id) => {
        checkForFriendRequests(id, dispatch);
        return id;
      })
      .then((id) => {
        checkForSentRequests(id, dispatch);
        return id;
      })
      .then((id) => {
        checkForConfirmedRequests(id, dispatch);
        return id;
      })
      .then((id) => {
        checkForConfirmedRequests2(id, dispatch);
        return id;
      })
      .catch((err) => {
        console.log('error', err);
        dispatch({ type: types.UNAUTH_USER });
      });
  }
};
