export default (searchResults = [], action) => {
  switch (action.type) {
    case 'QUERY_SEARCH':
      return [action.searchResults];
    case 'QUERY_REPOS':
      return [action.searchResults];
    default:
      return searchResults;
  }
};
