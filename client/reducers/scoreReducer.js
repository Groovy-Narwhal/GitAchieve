let getScore = (state) => {
  return state.score + 10;
}

export default (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      return getScore(state);
    default:
      return state;
  }
}
