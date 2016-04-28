import * as types from './actionTypes'

export const incrementScore = (num) => {
  return {
    type: types.INCREMENT_SCORE,
    num
  }
}

export const addToken = () => {
  return {
    type: types.ADD_TOKEN
  }
}
