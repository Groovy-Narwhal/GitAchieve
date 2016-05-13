export const sentRequests = (requests = [], action) => {
  switch (action.type) {
    case 'SENT_FR':
      return [action.sentRequests];
    default:
      return requests;
  }
};


export const receivedRequests = (requests = [], action) => {
  switch (action.type) {
    case 'RECEIVED_FR':
      return [action.receivedRequests];
    default:
      return requests;
  }
};

