import {
  UPDATE_USER
} from '../actions/actionTypes';

export default (state = {}, action) => {
  switch(action.type) {
    case UPDATE_USER:
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};