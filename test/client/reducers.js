import expect from 'expect'
import reducer from '../../client/reducers/userReducer'
import * as types from '../../client/actions/ActionTypes'

describe('users reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(
      {}
    )
  })

  it('should handle UPDATE_USER', () => {
    expect(
      reducer([], {
        type: types.UPDATE_USER,
        payload: {
          username: 'test',
          id: 'test',
          email: 'test',
          avatar_url: 'test'
        }
      })
    ).toEqual(
      {
        username: 'test',
        id: 'test',
        email: 'test',
        avatar_url: 'test'
      }
    )
  })
})