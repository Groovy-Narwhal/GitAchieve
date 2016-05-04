import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import score from './scoreReducer';
import tokens from './tokensReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import {reducer as formReducer} from 'redux-form';
import competitors from './competitorReducer';

export default combineReducers({
  score,
  tokens,
  routing: routerReducer,
  auth: authReducer,
  user: userReducer,
  competitors
});
