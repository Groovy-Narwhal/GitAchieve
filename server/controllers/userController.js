const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const gitHubMiner = require('../helpers/gitHubMiner');

// GET at /api/v1/users
exports.retrieveAllUsers = function(req, res) {
  db.query('SELECT * FROM users')
    .then((data) => res.send(data))
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
};

// POST at /api/v1/users
exports.addUser = function(req, res) {  
  var timestamp = new Date();
  db.any('INSERT INTO users (username, email, id, created_ga) ' +
    'VALUES ($1, $2, $3, $4)',
    [req.body.username, req.body.email, req.body.id, timestamp])
    .then((data) => res.status(201).send(req.body))
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
};  

// GET at '/api/v1/users/:id'
exports.retrieveUser = function(req, res) {
  var queryId = req.params.id;
  db.one('SELECT * FROM users WHERE id=$1', queryId)
    .then((data) => res.send(data))
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
};
