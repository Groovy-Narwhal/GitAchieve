import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import * as component from './components/index';
import RequireAuth from './components/requireAuth';
import configureStore from './store/store';
import * as types from './actions/actionTypes';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={component.App}>
        <IndexRoute component={RequireAuth(component.DashBoard)} />
        <Route path="/signin" component={component.Login} />
        <Route path="/about" component={component.About} />
        <Route path="/orgs" component={component.Organizations} />
        <Route path="/search-results" component={component.SearchResults} />
        <Route path="/:username/profile" component={component.UserProfile} />
        <Route path="/:reponame/repos" component={component.RepoProfile} />
        <Route path="/:orgname/orgs" component={component.OrgProfile} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
