var User = require('../models/User.js');

// '/'
exports.retrieve = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
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
