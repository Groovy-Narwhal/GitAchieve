var request = require('request');
const db = require('../db/database.js').db;

module.exports = (app) => {
  app.get('/gh-fetch', (req, res) => {
    var userid = req.query.id;
    var options = {
      url: `https://github.com/${req.query.username}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    request.get(options, (error, response, body) => {
      if (error) {
        console.log('Error in userGHFetcher: ', error);
      } else {
        var arr = body.slice(0, body.indexOf(' contributions in the last year'));
        var contributions_past_year = '';
        for (var i = arr.length - 1; i > 0 ; i--) {
          if (parseInt(arr[i]) || parseInt(arr[i]) === 0) {
            contributions_past_year += arr[i]
          } else {
            break;
          }
        }
        contributions_past_year = contributions_past_year.split('').reverse().join('');
        // TODO UPDATE DATABASE
        res.send(contributions_past_year);
      }
    });
  });
};
