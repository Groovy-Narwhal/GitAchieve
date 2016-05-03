import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, DashBoard, ScoreBoard, Login } from './components/index';
import configureStore from './store/store';
import * as types from './actions/actionTypes';

const initialState = {
  auth: {
    authenticated: false
  }
};

const store = configureStore(initialState);

const history = syncHistoryWithStore(browserHistory, store);

const token = localStorage.getItem('token');
console.log('TOKEN', token)
if (token) {
  store.dispatch({ type: types.AUTH_USER })
}

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={DashBoard} />
        <Route path="signin" component={Login} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
