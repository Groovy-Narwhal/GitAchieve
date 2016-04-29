import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './../reducers/combineReducers'

const configureStore = (initialState) => {
  const store = createStore(reducers, initialState, 
    window.devToolsExtension ? window.devToolsExtension() : undefined
  );
  return store;
}

export default configureStore