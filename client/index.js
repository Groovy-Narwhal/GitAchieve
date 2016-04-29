import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import App from './containers/app';
import configureStore from './store/store';

let initialState = {
  score: 0,
  tokens: [],
};

let store = configureStore(initialState);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path="v1/users" component={User} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);



// ReactDOM.render(
//   <Router history={browserHistory}>
//     <Route path="/events" component={App}>
//       <IndexRoute component={AddEventForm} />
//       <Route path="/events/:eventName" component={EventPage} />
//     </Route>
//   </Router>,
//   document.getElementById('app')
// );

// App.propTypes = {
//   children: React.PropTypes.object,
// };
