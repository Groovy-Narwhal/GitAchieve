export default function tokens(state = [], action) {
  switch (action.type) {
    case 'ADD_TOKEN':
      // return [...state.tokens, action.token]
      return Object.assign({}, state, {
        tokens: [...state.tokens, action.token]
      })
    default:
      return state;
  }
}

// export default tokens
