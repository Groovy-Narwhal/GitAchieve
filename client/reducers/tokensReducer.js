const tokens = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return Object.assign({}, state, {
        tokens: [...state.tokens, action.token]
      })
      // return [...state.tokens, action.token]
    default:
      return state;
  }
}

export default tokens
