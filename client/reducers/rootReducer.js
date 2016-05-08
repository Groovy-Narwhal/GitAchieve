import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import searchResults from './searchResultsReducer';
import searchInput from './searchInputReducer';
import searchUserEvents from './userEventsReducer';
import chosenSearchResult from './chosenSearchResultReducer';

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  user: userReducer,
  searchResults,
  searchInput,
  searchUserEvents,
  chosenSearchResult
});
