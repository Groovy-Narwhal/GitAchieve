import React from 'react';
import expect from 'expect';
import * as actions from '../../client/actions/ActionCreators';
import * as asyncActions from '../../client/actions/index';
import * as types from '../../client/actions/actionTypes';


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

