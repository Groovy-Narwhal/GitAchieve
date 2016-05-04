import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import score from './scoreReducer';
import tokens from './tokensReducer';
import authReducer from './authReducer';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
  score,
  tokens,
  routing: routerReducer,
  auth: authReducer,
  form: formReducer
});
