var request = require('request');

module.exports = (app) => {
  app.get('/gh-fetch', (req, res) => {
    console.log('this is req.params.username', req.query.username);
    var options = {
      url: `https://github.com/${req.query.username}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    request.get(options, (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        res.send(body);
      }
    });
  })
};