export default (competitors = [], action) => {
  switch (action.type) {
    case 'ADD_COMPETITOR':
      return [...competitors, action.competitor];
    default:
      return competitors;
  }
};
