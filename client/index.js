import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import combinedReducers from './reducers/combineReducers.js'
import App from './components/app'


export default function configureStore(initialState) {
  const store = createStore(combinedReducers, initialState, 
    window.devToolsExtension ? window.devToolsExtension() : undefined
  );
  return store;
}
// let store = createStore(combineReducers)

// console.log('STORE', store.getState())

render(
  <Provider store={configureStore({})}>
    <App />
  </Provider>,
  document.getElementById('root')
)
