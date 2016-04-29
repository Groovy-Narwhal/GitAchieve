import { combineReducers } from 'redux'
import { score } from './scoreReducer'
import { tokens } from './tokensReducer'


const reducers = combineReducers({
  score,
  tokens
})

export default reducers