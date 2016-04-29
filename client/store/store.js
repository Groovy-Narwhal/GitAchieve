import React from 'react'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import score from './../reducers/scoreReducer'
import tokens from './../reducers/tokensReducer'


let reducers = combineReducers({
  score,
  tokens
})

const finalCreateStore = compose(
  applyMiddleware(logger())
)(createStore)

const configureStore = (initialState) => {
  const store = finalCreateStore(tokens, initialState, 
    window.devToolsExtension ? window.devToolsExtension() : undefined
  );
  return store;
}

export default configureStore