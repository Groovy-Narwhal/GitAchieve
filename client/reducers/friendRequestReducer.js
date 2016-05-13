export default (requests = [], action) => {
  switch (action.type) {
    case 'RECEIVED_FR':
      return [action.receivedRequests];
    case 'SENT_FR':
      return [action.sentRequests];
    default:
      return requests;
  }
};