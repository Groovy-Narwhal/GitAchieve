export default function score(state = {}, action) {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      return Object.assign({}, state, {
        score: action.num
      })
    default:
      return state;
  }
}



 reducers
