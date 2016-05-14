const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const SEND_GRID_API = require('./../../server/config/sendGridKey');
const sendgrid  = require('sendgrid')(SEND_GRID_API.key);
const request = require('request');

var competitorEmail;

// @ISSUE: seems to be getting called twice (two emails, two 'in api' & json console logs)
// @ISSUE: also seem to be getting rejected promises in console (may be related to twice-sending)
// @TODO: add email to database in the cases that I fetch it

var sendEmail = (competitorEmail) => {

  var email     = new sendgrid.Email({
    to:       competitorEmail,
    from:     'gitachieve@gmail.com',
    subject:  'Message from SendGrid!',
    text:     'Hello from SendGrid'
  });

  sendgrid.send(email, function(err, json) {
    if (err) { console.error('sendGrid error:', err); }
    console.log('sendGrid sent an email (in invitationSender.js) with:', json);
  });
}


var getEmail = (user) => {
  var options = {
    url: `https://api.github.com/users/${user}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': user
    }
  };
  return request(options, (error, response, body) => {
    if (error) {
      console.error('error fetching competitor email from Github, in invitationSender.js: ', error);
    } else {
      competitorEmail = JSON.parse(body).email;
      sendEmail(competitorEmail);
    }
  });
}


module.exports = (app) => {

  app.get('/send-email', (req, res) => {

    var competitor = req.query.competitor;

    db.one(
      'SELECT u.id, u.username, u.email ' +
      'FROM users u ' +
      'WHERE u.username = ($1)',
      competitor
    )
    .then(data => {
      competitorEmail = data.email;

      // if competitor's email is not in the database, get it
      if (!competitorEmail) {
        getEmail(competitor);
        // ... and add it to the database

      }

      // otherwise send email immediately
      else {
        sendEmail(competitorEmail);
      }

    });
  });
};
