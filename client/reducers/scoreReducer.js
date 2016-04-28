const score = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      return Object.assign({}, state, {
        score: action.num
      })
    default:
      return state;
  }
}

export default score
