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
        <Route path="/:username/achievements" component={component.UserAchievements} />
        <Route path="/:username/repos" component={component.Repos} />
        <Route path="/:orgname/orgs" component={component.OrgProfile} />
        <Route path="/compete/choose-repo/:username" component={component.ChooseWeapon} />
        <Route path="/compete/choose-second-repo/:userid" component={component.ChooseSecondWeapon} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
