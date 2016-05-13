export default (requests = [], action) => {
  switch (action.type) {
    case 'REFRESH_FRIENDS':
      return [action.friends];
    // case 'ADD_FRIEND':
    //   return [...requests, action.payload];
    // case 'REMOVE_FRIEND':
    //   return [...requests, action.payload];
    default:
      return requests;
  }
};