import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import score from './scoreReducer';
import tokens from './tokensReducer';
import authReducer from './authReducer';

export default combineReducers({
  score,
  tokens,
  routing: routerReducer,
  auth: authReducer,
});
