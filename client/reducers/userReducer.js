import {
  UPDATE_USER,
  UNAUTH_USER
} from '../actions/actionTypes';

export default (state = {}, action) => {
  switch(action.type) {
    case UPDATE_USER:
      return Object.assign({}, action.payload);
    case UNAUTH_USER:
      return {};
    default:
      return state;
  }
};