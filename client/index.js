import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, DashBoard, ScoreBoard } from './containers/index';
import { Login } from './components/index';
import configureStore from './store/store';

const initialState = {
  score: 0,
  tokens: [],
};

const store = configureStore(initialState);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={DashBoard} />
        <Route path='/users' componenet={DashBoard} />
        <Route path='/login' component={Login} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
