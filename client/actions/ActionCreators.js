import * as types from './actionTypes';

export default {
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
  },
  getUserContribs: contributions => {
    return {
      type: types.GET_USER_CONTRIBS,
      contributions
    }
  }
};
