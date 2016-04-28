import * as types from './actionTypes'

export default actions = {
  incrementScore(num) {
    return {
      type: types.INCREMENT_SCORE,
      num
    }
  }
}
