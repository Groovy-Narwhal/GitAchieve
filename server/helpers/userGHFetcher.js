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
        var arr = body.slice(body.indexOf('<div class="boxed-group flush">') + 25);
        var contributions_past_year = arr.slice(body.indexOf('<div class="boxed-group flush">'));
        // var real_current_streak = '';
        // for (var i = 0; i < current_streak.length; i++) {
        //   if (parseInt(current_streak[i])) {
        //     real_current_streak += current_streak[i];
        //   } else {
        //     break;
        //   }
        // }
        var obj = {
          contributions_past_year: 0,
        };
        // UPDATE DATABASE
        console.log('LONG', arr);
        res.send(obj);
      }
    });
  });
};
