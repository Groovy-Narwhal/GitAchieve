export default (competitorsData = [], action) => {
  switch (action.type) {
    case 'ADD_COMPETITOR_DATA':
      return [...competitorsData, action.competitorData];
    default:
      return competitorsData;
  }
};
