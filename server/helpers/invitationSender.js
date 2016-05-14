// @TODO: add link that if clicked notifies the challenger their challenge was accepted
const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const SEND_GRID_API = require('./../../server/config/sendGridKey');
const sendgrid  = require('sendgrid')(SEND_GRID_API.key);
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

var competitorEmail;
var competitor; //username
var competitor_id;
var user; // logged in user; used in the text of the sent email

// sends email with SendGrid
var sendEmail = (competitorEmail) => {

  var email = new sendgrid.Email({
    to:     competitorEmail,
    from:   'gitachieve@gmail.com',
    subject: `${user} wants to compete with you on GitAchieve`,
    text:   "You've been challenged by ${user} on GitAchieve!\nAccept the invitation"
  });

  sendgrid.send (email, function (err, json) {
    if (err) {
      console.error('sendGrid error:', err);
    }
    console.log('sendGrid sent an email (in invitationSender.js) with:', json);
  });
}

// gets competitor's email if it's not in the db
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

// updates the database (if getEmail is called) with competitor's email
var patchDatabase = (competitor) => {

  var options = {
    url: CALLBACKHOST + '/api/v1/users/' + competitor_id,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'username': competitor
    }
  };
  return request(options, (error, response, body) => {
    if (error) {
      console.error('Error in invitationSender.js:', error);
    } else {
      console.log('Success in invitationSender.js:');
    }
  });
};



// sends email after ensuring competitor email exists
module.exports = (app) => {

  app.get('/send-email', (req, res) => {

    user = req.query.user;
    competitor = req.query.competitor;
    competitor_id = req.query.competitor_id;

    db.one(
      'SELECT u.id, u.username, u.email ' +
      'FROM users u ' +
      'WHERE u.username = $1',
      competitor
    )
    .then(data => {
      competitorEmail = data.email;

      // if competitor's email is not in the database, get it
      if (!competitorEmail) {
        getEmail(competitor);
        // and update the database
        patchDatabase(competitor);
      }

      // otherwise send email immediately
      else {
        sendEmail(competitorEmail);
      }

    })
    .catch(err =>
      console.log('error with db.one in invitationSender, user probably does not exist:',err)
    );
  });
};
