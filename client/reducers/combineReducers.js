import { combineReducers } from 'redux';
import score from './scoreReducer';
import tokens from './tokensReducer';


export default combineReducers({
  score,
  tokens
});
