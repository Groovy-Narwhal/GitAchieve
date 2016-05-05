export default (userEvents = [], action) => {
  switch (action.type) {
    case 'SEARCH_USER_EVENTS':
      console.log('Search user Events', action.searchUserEvents, 'userEvents: ', userEvents);
      return action.userEvents;
    default:
      return userEvents;
  }
};
