import React from 'react';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import reducers from './../reducers/combineReducers';

const finalCreateStore = compose(
  applyMiddleware(logger())
)(createStore);

const configureStore = initialState => {
  const store = finalCreateStore(reducers, initialState, 
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
  return store;
}

export default configureStore;
