export default (searchInput = '', action) => {
  switch (action.type) {
    case 'INPUT_SEARCH':
      return `${action.searchInput}`;
    default:
      return searchInput;
  }
};
