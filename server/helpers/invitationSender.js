const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const SEND_GRID_API = require('./../../server/config/sendGridKey');
const sendgrid  = require('sendgrid')(SEND_GRID_API.key);
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

var competitorEmail;
var competitor; //competitor's username
var competitor_id;
var user; // logged in user's username; used in the text of the sent email

// sends email with SendGrid
var sendEmail = (competitorEmail) => {

  /* There's a bug where 2 or 3 emails are often sent in quick succession
    instead of just one.
    Work-around for now is to check the database for email-last-sent
    at /api/v1/users/:id/friends and finding the specific competitor
    In addition, we add that field with the current date when it doesn't exist.
  */
  db.any(
    'SELECT uu.last_email_invite ' +
    'FROM users_users uu ' +
    'WHERE uu.secondary_user_id = $1',
    competitor_id
  )
  .then(data => {
    var emailLastSent = data[0].last_email_invite
    if (emailLastSent === null) {
      var now = new Date();
      db.oneOrNone('UPDATE users_users ' +
      'SET last_email_invite=($1) ' +
      'WHERE users_users.secondary_user_id=($2) ' +
      'RETURNING *',
      [now, competitor_id]
      )
      .then(data => {
        var email = new sendgrid.Email({
          to: competitorEmail,
          from: 'gitachieve@gmail.com',
          subject: `${user} wants to compete with you on GitAchieve`,
          html: `<h2>You\'ve received a challenge on GitAchieve!</h2><p>Github user ${user} wants to compete with you. Select one repo and make more commits within the time limit to win! </p><p><a>Create an account</a> at gitachieve.com in seconds with Github login.</p>`
        });
        sendgrid.send(email, function (err, json) {
          if (err) {
            console.error('sendGrid error:', err);
          }
          console.log('sendGrid sent an email (in invitationSender.js) with:', json);
        });
      });
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
      if (competitorEmail) {
        sendEmail(competitorEmail);
      }
    })
    .catch(err =>
      console.log('error with db.one in invitationSender, user probably does not exist:', err)
    );
  });

};
