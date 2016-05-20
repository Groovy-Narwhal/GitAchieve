var request = require('request');
var db = require('../db/database.js').db;
var pgp = require('../db/database.js').pgp;
var PORT = require('../config/config-settings').PORT;
var HOST = require('../config/config-settings').HOST;
var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// GET at /api/v1/users to retrieve all users
exports.retrieveAllUsers = function(req, res) {
  db.one('SELECT * FROM users')
    .then((data) => res.send(data))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error reading users table');
    });
};

// POST at /api/v1/users
exports.addUser = function(req, res) {
  var dbTimestamp = pgp.as.date(new Date());
  db.one('INSERT INTO users (username, email, id, created_ga) ' +
    'VALUES ($1, $2, $3, $4) ' +
    'RETURNING *',
    [req.body.username, req.body.email, req.body.id, dbTimestamp])
    .then((data) => res.status(201).send(data))
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
};

// GET at '/api/v1/users/:id' to get a user by id
exports.retrieveUser = function(req, res) {
  var queryId = req.params.id;
  db.one('SELECT * FROM users WHERE id=$1', queryId)
    .then((data) => res.send(data))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error searching database for user');
    });
};

// PATCH at '/api/v1/users/:id' to update user with current GitHub data
exports.patchUser = function(req, res) {
  var queryId = req.params.id;
  var username = req.body.username;
  var competitorUsername = req.body.competitorUsername;
  var dbTimestamp = pgp.as.date(new Date());
   
  // HELPER FUNCTIONS
  // get user info from GitHub
  var getUserFromGitHub = function() {
    var options = {
      url: 'https://api.github.com/users/' + competitorUsername,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        upsertUser(JSON.parse(body));
      }
    });
  };

  // if user exists, update their info; otherwise, add them
  // this is an 'upsert' - it will insert a record if it does not exist, or update it if it exists
  var upsertUser = function(body) {
    db.one('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~, $9~) ' +
      'VALUES ($10, $11, $12, $13, $14, $15, $16) ' +
      'ON CONFLICT ($3~) ' +
      'DO UPDATE SET ($17~, $5~, $6~, $7~, $8~, $9~) = ($11, $12, $13, $14, $15, $16) ' +
      'WHERE $2~.$3~ = $10 ' +
      'RETURNING *',
      ['users', 'u', 'id', 'created_ga', 'username', 'email', 'avatar_url', 'followers', 'following',
      queryId, dbTimestamp, body.login, body.email, body.avatar_url, body.followers, body.following, 'updated_ga'])
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      // if the user was not found, send 404
      console.error(error);
      if (error.code === 0) {
        res.status(404).send('User does not exist');
      } else {
        res.status(500).send('Error searching database for user');
      }
    });
  };

  // CALL HELPERS
  getUserFromGitHub(getUserFromGitHub);
};

// PUT at '/api/v1/users/:id' to update user manually
// send the parameters to be updated in the request body
exports.updateUser = function(req, res) {
  var queryId = req.params.id;
  var update = req.body;
  var dbTimestamp = pgp.as.date(new Date());
  
  db.one('SELECT * FROM users WHERE id=$1', queryId)
    .then(user => {
      for (var key in update) {
        user[key] = update[key];
      }
      db.one('UPDATE $1~ SET ($2~, $3~, $4~, $5~, $6~, $7~, $8~, $9~, $10~, $11~, $12~, $13~, $14~, ' +
        '$15~, $16~, $17~) = ' +
        '($18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33) ' +
        'WHERE $34~ = $35 ' +
        'RETURNING *',
        ['users', 'updated_ga', 'signed_up', 'username', 'email', 'avatar_url', 'followers', 
        'following', 'total_score', 'losses', 'wins', 'longest_streak', 'current_streak', 
        'contributions_past_year', 'commits_count', 'repos_count', 'pull_requests_count',
        dbTimestamp, user.signed_up, user.username, user.email, user.avatar_url, user.followers,
        user.following, user.total_score, user.losses, user.wins, user.longest_streak, 
        user.current_streak, user.contributions_past_year, user.commits_count, user.repos_count,
        user.pull_requests_count, 'id', queryId])
        .then(updatedUser => {
          res.send(updatedUser);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error updating user');
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error searching database for user');
    });
  
};


// DELETE at '/api/v1/users/:id'
exports.deleteUser = function(req, res) {
  var queryId = req.params.id;
  // delete the user and return all deleted rows
  db.one('DELETE FROM users WHERE id=$1 RETURNING *', queryId)
    .then((data) => res.send(data))
    .catch((error) => {
      if (error.code === 0) {
        console.error(error);
        res.status(404).send('User does not exist');
      } else {
        console.error(error);
        res.status(500).send('Error searching database for user');
      }
    });
};
