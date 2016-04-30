var User = require('../models/User.js');
var db = require('../db/database.js');

// '/'
exports.retrieve = function(req, res) {
  var dbQuery = db.run('SELECT * FROM users', function(err, res) {
    if (err) {
      console.error(err);
    } else {
      console.log('db response in retrieve: ', res);
      return res; 
    }
  });
  console.log('in retrieve, dbQuery: ', dbQuery);
  res.status(200);
  res.json(dbQuery);
    
};

exports.addOne = function(req, res) {
  var query = {_id: req.params.id};
  // db.run('INSERT INTO users ')
};

// for adding sample data to test the database
exports.addSampleData = function(req, res) {
  db.users.insert({
    userid: 1,
    username: 'groovynarwhal',
    email: 'unicornwhale@gmail.com'
  }, function(err, res){
    if (err) {
      console.error(err);
    }
    console.log('Added sample data');
  });
};

// '/:username'
exports.retrieveOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
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
