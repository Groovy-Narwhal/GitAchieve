const score = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_SCORE':
      // return Object.assign({}, state, {
      //   score: action.num
      // })
      return state + 1
    default:
      return state;
  }
}

export default score
