import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, Login, Signout, About, DashBoard } from './components/index';
import RequireAuth from './components/requireAuth';
import configureStore from './store/store';
import * as types from './actions/actionTypes';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

const token = localStorage.getItem('token');

if (token) {
  store.dispatch({ type: types.AUTH_USER })
}

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Login} />
        <Route path="/signout" component={Signout} />
        <Route path="/about" component={About} />
        <Route path="/users" component={RequireAuth(DashBoard)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
