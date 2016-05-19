import {
  GET_USER_CONTRIBS
} from '../actions/actionTypes';

export default (state = [], action) => {
  switch(action.type) {
    case GET_USER_CONTRIBS:
      return [action.contribs];
    default:
      return state;
  }
};