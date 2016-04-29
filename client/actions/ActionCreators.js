import * as types from './actionTypes'

export default {
  incrementStore: num => {
    return {
      type: types.INCREMENT_SCORE,
      num
    }
  },
  addToken: token => {
    return {
      type: types.ADD_TOKEN,
      token
    }
  }
}

// export const incrementScore = (num) => {
//   return {
//     type: types.INCREMENT_SCORE,
//     num
//   }
// }

// export const addToken = (token) => {
//   return {
//     type: types.ADD_TOKEN,
//     token
//   }
// }
