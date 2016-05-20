var request = require('request');
const db = require('../db/database.js').db;

module.exports = (app) => {
  app.get('/gh-fetch', (req, res) => {
    var userid = req.query.id;
    console.log('USERNAME', req.query.username)
    var options = {
      url: `https://github.com/${req.query.username}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'token 453c02c883ccfcf2d07d4dadc96c821424dfd36b'
      }
    };
    request.get(options, (error, response, body) => {
      if (error) {
        console.log('Error in userGHFetcher: ', error);
      } else {
        // var contributions_past_year = body.slice(body.indexOf('<div class="boxed-group flush">'));
        var longest_streak = body.slice(body.indexOf('<span class="text-muted">Longest streak</span>') + 90, body.indexOf(' days</span>'));
        var current_streak = body.slice(body.indexOf('Current streak</span>') + 65, body.indexOf('Current streak</span>') + 70);
        var real_current_streak = '';
        for (var i = 0; i < current_streak.length; i++) {
          if (parseInt(current_streak[i])) {
            real_current_streak += current_streak[i];
          } else {
            break;
          }
        }
        var obj = {
          contributions_past_year: contributions_past_year,
          longest_streak: longest_streak,
          current_streak: real_current_streak
        };
        var obj = {};
        // UPDATE DATABASE
        console.log('LONG', body);
        res.send(obj);
      }
    });
  });
};
