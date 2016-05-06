import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, Login, Signout, About, DashBoard } from './components/index';
import RequireAuth from './components/requireAuth';
import UserProfile from './components/userProfile';
import configureStore from './store/store';
import * as types from './actions/actionTypes';
import SearchResults from './components/searchResults';

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
        <IndexRoute component={RequireAuth(DashBoard)} />
        <Route path="/signin" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/:username/profile" component={UserProfile} />
        <Route path="/search-results" component={SearchResults} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
