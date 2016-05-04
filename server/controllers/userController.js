const db = require('../db/database.js');

// GET at /api/v1/users
exports.retrieveAllUsers = function(req, res) {
  db.run(
    'SELECT * FROM users',
    function(err, data) {
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else {
        res.send(data);
      }
    }); 
};

// POST at /api/v1/users
exports.addUser = function(req, res) {  
  var timestamp = new Date();
  db.run(
    'INSERT INTO users (username, email, id, created_ga) ' +
    'VALUES ($1, $2, $3, $4)',
    [req.body.username, req.body.email, req.body.id, timestamp],
    function(err, data) {
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
exports.retrieveUser = function(req, res) {
  var queryId = req.params.id;
  db.run(
    'SELECT * FROM users WHERE id=($1)',
    [queryId],
    function(err, data) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(data);
      }    
    });
};

// PATCH at '/api/v1/users/:id'
exports.updateUser = function(req, res) {
  var queryId = req.params.id;

  // first, find the user by id
  db.run(
    'SELECT * FROM users WHERE id=($1)',
    [queryId],
    function(err, data) {
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
            db.run(
              'UPDATE users SET ' + key + 
              '=($1) WHERE id=($2)', 
              [req.body[key], queryId], 
              function (err, data) {
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
exports.deleteUser = function(req, res) {
  var queryId = req.params.id;
  db.users.destroy({id: queryId}, function(err, data) {
    if (err) {
      res.send(500);
    } else {
      res.send(data);
    }
  });
};

// GET at '/api/v1/users/:id/repos'
exports.retrieveRepos = function(req, res) {
  var queryId = req.params.id;
  // this Inner Join will return all the repos for a given user id
  // the breakdown: 
  // SELECT [fields from target table] 
  // FROM [join table x] 
  // INNER JOIN [target table y] 
  // ON [y.privateKey] = y.foreignKey1 
  // WHERE y.foreignKey2 = queryId
  db.run(
    ('SELECT r.id, r.created_ga, r.created_at, r.watchers_count, r.stargazers_count, r.forks_count ' + 
    'FROM users_repos ur ' +
    'INNER JOIN repos r ' + 
    'ON r.id = ur.repo_id ' + 
    'WHERE ur.user_id =($1)'), 
    [queryId], 
    function(err, data) {
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else {
        res.send(data);
      }
    }); 
};

// POST at '/api/v1/users/:id/repos'
exports.addRepo = function(req, res) {
  var queryId = req.params.id;
  var timestamp = new Date();
    // add repo to the repos table
  db.run(
    'INSERT INTO repos (id, created_ga, created_at, watchers_count, stargazers_count, forks_count) ' +
    'VALUES ($1, $2, $3, $4, $5, $6)', 
    [req.body.id, timestamp, req.body.created_at, req.body.watchers_count, 
      req.body.stargazers_count, req.body.forks_count], 
    function(err, data) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        // if repo addition was successful, add corresponding entry in join table
        db.run(
        'INSERT INTO users_repos (created_ga, repo_id, user_id) ' +
        'VALUES ($1, $2, $3)', 
        [timestamp, req.body.id, queryId], 
        function(err, data) {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          } else {
            console.log('Repo created with id: ' + req.body.id);
            res.status(201);
            res.send(req.body);
          }
        });
      }
    });
};


// GET at '/api/v1/users/:id/friends'
exports.retrieveFriends = function(req, res) {
  var queryId = req.params.id;
  
};

// POST at '/api/v1/users/:id/friends'
exports.addFriend = function(req, res) {
  // this is the id of the person sending the invitation to compete
  var primaryUserId = req.params.id; 
  // this is the id of the person receiving the invitation to compete
  var secondaryUserId = req.body.secondaryUserId;
  var secondaryUsername = req.body.secondaryUsername;
  var secondaryUserEmail = req.body.secondaryUserEmail;
  var timestamp = new Date();
  // check if the secondaryUserId exists in users table
  db.run(
  'SELECT * FROM users WHERE id=($1)',
  [secondaryUserId],
  function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } 
    if (data.length > 0) {
      console.log('Secondary user exists with id: ' + data[0].id + ' and username: '
        + data[0].username);
      // if secondary user doesn't exist, add to users table with signedUp = false
    } else {
      db.run(
        'INSERT INTO users (id, username, email, created_ga, signed_up) ' +
        'VALUES ($1, $2, $3, $4, $5)',
        [secondaryUserId, secondaryUsername, secondaryUserEmail, timestamp, false],
        function(err, data) {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          } else {
            console.log('Secondary user created with username: ' + secondaryUsername + 
              ' and email: ' + secondaryUserEmail + ', signed_up = false');
          }
        }); 
    }
    // once we are sure the secondary user exists, add relationship to the users_users table
    db.run(
    'INSERT INTO users_users (created_ga, primary_user_id, secondary_user_id) ' +
    'VALUES ($1, $2, $3)', 
    [timestamp, primaryUserId, secondaryUserId], 
    function(err, data) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log('Friendship initiated with primaryUserId: ' + primaryUserId + 
          ', secondaryUserId: ' + secondaryUserId);
        res.status(201);
        res.send(req.body);
      }
    });    
  });
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
