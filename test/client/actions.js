import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../client/actions/ActionCreators';
import * as asyncActions from '../../client/actions/index';
import * as types from '../../client/actions/actionTypes';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);

/* Front-end Tests */
describe('actions', () => {

  it('should create an action to authorize a user', () => {
    const expectedAction = {
      type: types.AUTH_USER
    }
    expect(actions.default.authUser()).toEqual(expectedAction);
  });
  
  it('should create an action to unauthorize a user', () => {
    const expectedAction = {
      type: types.UNAUTH_USER
    }
    expect(actions.default.unAuthUser()).toEqual(expectedAction);
  });

});

// describe('async actions', () => {
  
//   afterEach(() => {
//     nock.cleanAll()
//   })

//   it('should authenticate users on sign in', () => {
//     nock('http://localhost:8000')
//       .get('/github/profile')
//       .reply(200, { data: { data: {}}})
//       const expectedActions = [
//         { type: types.AUTH_USER },
//         { type: types.UNAUTH_USER }
//       ]
//       const store = mockStore({
//         auth: {
//           authorized: true
//         }
//       });
//       return store.dispatch(asyncActions.signinUser())
//         .then(() => {
//           expect(store.getActions()).toEqual(expectedActions)
//         });
//   });

  // it('should log users out', () => {
  //   nock('http://localhost:8000')
  //     .get('/signout')
  //     const expectedActions = [
  //       { type: types.UNAUTH_USER }
  //     ]
  //     const store = mockStore({
  //       auth: {
  //         authorized: false
  //       }
  //     });
  //     return store.dispatch(asyncActions.signoutUser())
  //       .then(() => {
  //         expect(store.getActions()).toEqual(expectedActions)
  //       });
  //   });

// });
