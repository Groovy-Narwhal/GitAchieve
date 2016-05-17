export default (competitorsData = [], action) => {
  switch (action.type) {
    case 'ADD_COMPETITOR_DATA':
      return [action.competitorData];
    default:
      return competitorsData;
  }
};
