import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import score from './scoreReducer';
import tokens from './tokensReducer';


export default combineReducers({
  score,
  tokens,
  routing: routerReducer
});
