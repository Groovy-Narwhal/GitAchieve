export default (userEvents = [], action) => {
  switch (action.type) {
    case 'SEARCH_USER_EVENTS':
      return action.userEvents;
    default:
      return userEvents;
  }
};
