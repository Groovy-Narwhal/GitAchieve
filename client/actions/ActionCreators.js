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
  },
  querySearch: searchResults => {
    return {
      type: types.QUERY_SEARCH,
      searchResults
    }
  },
  queryRepos: searchResults => {
    return {
      type: types.QUERY_REPOS,
      searchResults
    }
  },
  inputSearch: searchInput => {
    return {
      type: types.INPUT_SEARCH,
      searchInput
    }
  },
  searchUserEvents: userEvents => {
    return {
      type: types.SEARCH_USER_EVENTS,
      userEvents
    }
  },
  chooseSearchResult: chosenSearchResult => {
    return {
      type: types.CHOOSE_SEARCH_RESULT,
      chosenSearchResult
    }
  }
};
