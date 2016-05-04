import React from 'react';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import reducers from './../reducers/rootReducer';

const finalCreateStore = compose(
  applyMiddleware(logger(), reduxThunk)
)(createStore);


const configureStore = initialState => {
  const store = finalCreateStore(reducers, initialState, 
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
  return store;
}

export default configureStore;
