const token = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      // return Object.assign({}, state, {
      //   score: action.num
      // })
      return {
        ...state,
        token: [1]
      }
    default:
      return state;
  }
}

export default token
