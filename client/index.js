import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, Login, Signout, About, DashBoard, RepoProfile , UserProfile } from './components/index';
import RequireAuth from './components/requireAuth';
import configureStore from './store/store';
import * as types from './actions/actionTypes';
import SearchResults from './components/searchResults';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={RequireAuth(DashBoard)} />
        <Route path="/signin" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/search-results" component={SearchResults} />
        <Route path="/:username/profile" component={UserProfile} />
        <Route path="/:reponame/repos" component={RepoProfile} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
