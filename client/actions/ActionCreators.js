import * as types from './actionTypes'

export const incrementScore = (num) => {
  return {
    type: types.INCREMENT_SCORE,
    num
  }
}

export const addToken = (token) => {
  return {
    type: types.ADD_TOKEN,
    token
  }
}
