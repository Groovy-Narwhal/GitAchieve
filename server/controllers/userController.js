const db = require('../db/database.js');

// GET at /api/v1/users
exports.retrieve = function(req, res) {
  db.run('SELECT * FROM users', function(error, response) {
    if (error) {
      console.error(error);
    } else {
      res.send(response);
    }
  }); 
};

// POST at /api/v1/users
exports.addOne = function(req, res) {  
  var timestamp = new Date();
  db.run('INSERT INTO users (username, email, id, created_ga) VALUES ($1, $2, $3, $4)', [req.body.username, req.body.email, req.body.id, timestamp], function(error, response) {
    if (error) {
      console.error(error);
    } else {
      var message = 'User created with username: ' + req.body.username + ' and email: ' + req.body.id;
      res.status(201);
      res.send(message);
    }
  });
};

// '/:username'
// ** Currently not working - it is not passing in a specific username **
exports.retrieveOne = function(req, res) {
  console.log('req.params', req.params);
  var queryUser = req.params.username;
  db.run('SELECT * FROM users WHERE username=($1)', [queryUser], function(error, response) {
    if (error) {
      console.error(error);
    } else {
      res.send(response);
    }    
  });
};

exports.updateOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.deleteOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:username/repos'
exports.retrieveRepos = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:username/friends'
exports.retrieveFriends = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addFriend = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:username/stats'
exports.retrieveStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:username/achievements'
exports.retrieveAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
}; 
