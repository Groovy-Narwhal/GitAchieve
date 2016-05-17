export default (dailyCompetitorsData = [], action) => {
  switch (action.type) {
    case 'ADD_DAILY_COMPETITOR_DATA':
      return [action.dailyCompetitorData];
    default:
      return dailyCompetitorsData;
  }
};
