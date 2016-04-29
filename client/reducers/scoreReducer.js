let getScore = (state) => {
  return state.score + 10
}

export default function score(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      // return getScore(state)
      return Object.assign({}, state, {
        score: getScore(state)
      })
    default:
      return state;
  }
}

// export default score
