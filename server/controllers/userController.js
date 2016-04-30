var User = require('../models/User.js');
var db = require('../db/database.js');

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
  var addUser = req.body.username;
  var addEmail = req.body.email;
  db.run('INSERT INTO users (username, email) VALUES ($1, $2)', [addUser, addEmail], function(error, response) {
    if (error) {
      console.error(error);
    } else {
      var message = 'User created with username: ' + addUser + ' and email: ' + addEmail;
      res.status(201);
      res.send(message);
    }
  });
};

// '/:username'
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
