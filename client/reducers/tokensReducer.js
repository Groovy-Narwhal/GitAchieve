export default (tokens = [], action) => {
  switch (action.type) {
    case 'ADD_TOKEN':
      return [...tokens, action.token];
    default:
      return tokens;
  }
}
