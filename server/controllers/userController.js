const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// GET at /api/v1/users to retrieve all users
exports.retrieveAllUsers = function(req, res) {
  db.query('SELECT * FROM users')
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
exports.updateUser = function(req, res) {
  var queryId = req.params.id;
  var username = req.body.username;
  var competitorUsername = req.body.competitorUsername;
  var dbTimestamp = pgp.as.date(new Date());

console.log(username, competitorUsername)
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
