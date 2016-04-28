import * as types from './actionTypes'

export const incrementScore = (num) => {
  return {
    type: types.INCREMENT_SCORE,
    num
  }
}
