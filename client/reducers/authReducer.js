import {
  AUTH_USER,
  UNAUTH_USER
} from '../actions/actionTypes';

export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return { authenticated: true };
    case UNAUTH_USER:
      return { authenticated: false };
    default:
      return state;
  }
};
