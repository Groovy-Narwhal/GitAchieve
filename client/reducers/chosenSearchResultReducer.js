export default (chosenSearchResult = {}, action) => {
  switch (action.type) {
    case 'CHOOSE_SEARCH_RESULT':
      return action.chosenSearchResult;
    default:
      return chosenSearchResult;
  }
};
