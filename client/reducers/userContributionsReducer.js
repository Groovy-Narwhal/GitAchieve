import {
  GET_USER_CONTRIBS
} from '../actions/actionTypes';

export default (state = [0], action) => {
  switch(action.type) {
    case GET_USER_CONTRIBS:
      return [action.contributions];
    default:
      return state;
  }
};