let getScore = (score) => {
  return score + 10;
}

export default (score = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      return getScore(score);
    default:
      return score;
  }
}
