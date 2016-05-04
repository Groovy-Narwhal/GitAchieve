import * as types from './actionTypes';

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
  },
  authUser: () => {
    return {
      type: types.AUTH_USER
    }
  },
  unAuthUser: () => {
    return {
      type: types.UNAUTH_USER
    }
  }
};
