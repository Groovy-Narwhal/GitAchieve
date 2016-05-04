const db = require('../db/database.js');

// GET at /api/v1/users
exports.retrieve = function(req, res) {
  db.run('SELECT * FROM users', function(err, data) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    } else {
      res.send(data);
    }
  }); 
};

// POST at /api/v1/users
exports.addOne = function(req, res) {  
  var timestamp = new Date();
  db.run('INSERT INTO users (username, email, id, created_ga) VALUES ($1, $2, $3, $4)', [req.body.username, req.body.email, req.body.id, timestamp], function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      console.log('User created with username: ' + req.body.username + ' and email: ' + req.body.id);
      res.status(201);
      res.send(req.body);
    }
  });
};

// GET at '/api/v1/users/:id'
exports.retrieveOne = function(req, res) {
  var queryId = req.params.id;
  db.run('SELECT * FROM users WHERE id=($1)', [queryId], function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      // if there is no matching user
      if (data.length === 0) {
        // send 404
        res.send(404);
      } else {
        // otherwise, send matching user
        res.send(data);
      }
    }    
  });
};

// PATCH at '/api/v1/users/:id'
exports.updateOne = function(req, res) {
  var queryId = req.params.id;

  // first, find the user by id
  db.run('SELECT * FROM users WHERE id=($1)', [queryId], function(err, data) {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      // if there are no matching users,
      if (data.length === 0) {
        // send 404
        res.send(404);
      } else { // if there is a matching user,
        // set up keyCount to determine when to send the full response
        var keyCount = 0;
        // check every key in the request body
        for (var key in req.body) {
          // if the user does not have that property
          if (data[0][key] === undefined) {
            // send 500
            res.status(500).send('You are trying to update the user.' + key + ' property, which doesn\'t exist');
          } else {
            // otherwise, increment key count
            keyCount++;
          }
        }
        // copy user into an object called updatedUser
        var updatedUser = data[0];
        // for each key:value pair in the request body
        for (var key in req.body) {
          // update the updatedUser
          updatedUser[key] = req.body[key];
          // and update the database
          db.run('UPDATE users SET ' + key + '=($1) WHERE id=($2)', [req.body[key], queryId], function (err, data) {
            if (err) {
              console.error(err.message);
              res.status(500).send(err);
            } else {
              // each time a key is added to the database, decrement keyCount
              keyCount --;
              // when there are no more keys left
              if (keyCount === 0) {
                // send the updated user back
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
