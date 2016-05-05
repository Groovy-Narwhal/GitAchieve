export default (searchResults = [], action) => {
  switch (action.type) {
    case 'QUERY_SEARCH':
      return [action.searchResults];
    default:
      return searchResults;
  }
};
