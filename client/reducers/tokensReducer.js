export default (state = [], action) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return [...state, action.token];
    default:
      return state;
  }
}
