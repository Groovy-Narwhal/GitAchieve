import { combineReducers } from 'redux'
import { score } from './scoreReducer'
import { token } from './tokenReducer'

const combinedReducers = combineReducers({
  score,
  token
})

export default combinedReducers