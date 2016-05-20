import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import searchResults from './searchResultsReducer';
import searchInput from './searchInputReducer';
import searchUserEvents from './userEventsReducer';
import chosenSearchResult from './chosenSearchResultReducer';
import userContributions from './userContributionsReducer';
import competitors from './competitorsReducer';
import competitorsData from './competitorDataReducer';
import dailyCompetitorsData from './dailyCompetitorDataReducer';
import chosenWeapons from './chosenWeaponsReducer';
import { pastCompetitions, yesCompetitions, sentRequests, receivedRequests, confirmedRequests, confirmedRequests2 } from './friendRequestReducer.js';

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  user: userReducer,
  searchResults,
  searchInput,
  searchUserEvents,
  chosenSearchResult,
  userContributions,
  competitors,
  competitorsData,
  dailyCompetitorsData,
  chosenWeapons,
  dailyCompetitorsData,
  sentRequests,
  receivedRequests,
  confirmedRequests,
  confirmedRequests2,
  yesCompetitions,
  pastCompetitions
});
