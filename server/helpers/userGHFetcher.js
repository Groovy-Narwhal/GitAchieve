var request = require('request');

module.exports = (app) => {
  app.get('/gh-fetch', (req, res) => {
    var options = {
      url: `https://github.com/${req.query.username}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    request.get(options, (error, response, body) => {
      if (error) {
        console.log('Error in userGHFetcher: ', error);
      } else {
        res.send(body);
      }
    });
  });
};
