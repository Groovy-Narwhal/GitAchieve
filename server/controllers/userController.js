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

// GET at '/api/v1/users/:id'
exports.retrieveOne = function(req, res) {
  var queryId = req.params.id;
  db.run('SELECT * FROM users WHERE id=($1)', [queryId], function(error, user) {
    if (error) {
      console.error(error);
    } else {
      res.send(user);
    }    
  });
};

// PATCH at '/api/v1/users/:id'
exports.updateOne = function(req, res) {
  var queryId = req.params.id;
  var keyCount = 0;
  for (var key in req.body) {
    keyCount++;
  }
  db.run('SELECT * FROM users WHERE id=($1)', [queryId], function(error, user) {
    if (error) {
      console.error(error);
    } else {
      if (user.length === 0) {
        res.status(404).send();
      } else {
        var updatedUser = user[0];
        for (var key in req.body) {
          updatedUser[key] = req.body[key];
          db.run('UPDATE users SET ' + key + '=($1) WHERE id=($2)', [req.body[key], queryId], function (err, user) {
            if (err) {
              console.error(err);
            } else {
              keyCount --;
              if (keyCount === 0) {
                res.send(updatedUser);
              }
            }
          });
        }
      }
    }    
  });
};

// DELETE at '/api/v1/users/:id'
exports.deleteOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/api/v1/users/:id/repos'
exports.retrieveRepos = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/api/v1/users/:id/friends'
exports.retrieveFriends = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addFriend = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/api/v1/users/:id/stats'
exports.retrieveStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/api/v1/users/:id/achievements'
exports.retrieveAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
}; 
