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

export const confirmedRequests = (requests = [], action) => {
  switch (action.type) {
    case 'CONFIRMED_FR':
      return [action.confirmedRequests];
    default:
      return requests;
  }
};

export const confirmedRequests2 = (requests = [], action) => {
  switch (action.type) {
    case 'CONFIRMED_FR2':
      return [action.confirmedRequests2];
    default:
      return requests;
  }
};

export const pastCompetitions = (history = [], action) => {
  switch (action.type) {
    case 'PAST_COMPETITIONS':
      return [action.pastCompetitions];
    default:
      return history;
  }
};

export const yesCompetitions = (competitions = false, action) => {
  switch (action.type) {
    case 'YES_COMPETITIONS':
      return true;
    default:
      return competitions;
  }
};
