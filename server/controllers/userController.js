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
        console.log('User created - username: ' + req.body.username + ', email: ' + req.body.id);
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
  // ON [y.privateKey] = [y.foreignKey1]
  // WHERE [y.foreignKey2] = [queryId]
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
  // select all the secondary users associated with this user
  db.run(
    ('SELECT u.id, u.username, u.email ' + 
    'FROM users_users uu ' +
    'INNER JOIN users u ' +
    'ON u.id = uu.secondary_user_id ' +
    'WHERE uu.confirmed_at IS NOT NULL ' +
    'AND uu.primary_user_id =($1)'), 
    [queryId],
    function(err, data) {
      if (err) {
        res.status(500).send(err);
        console.error(err);
      } else {
        // select all the primary users associated with this user
        db.run(
          ('SELECT u.id, u.username, u.email ' + 
          'FROM users_users uu ' +
          'INNER JOIN users u ' +
          'ON u.id = uu.primary_user_id ' +
          'WHERE uu.confirmed_at IS NOT NULL ' +
          'AND uu.secondary_user_id =($1)'), 
          [queryId],
          function(err2, data2) {
            if (err2) {
              res.status(500).send(err2);
              console.error(err2);
            } else {
              // send the combined data back
              res.send(data.concat(data2));
            }
          }); 
      }
    }); 
};

// POST at '/api/v1/users/:id/friends'
exports.addFriend = function(req, res) {
  // this is the person sending the invitation to compete
  var primaryUserId = req.params.id; 
  // this is the person receiving the invitation to compete
  var secondaryUserId = req.body.secondaryUserId;
  var secondaryUsername = req.body.secondaryUsername;
  var secondaryUserEmail = req.body.secondaryUserEmail;
  var timestamp = new Date();
  
  // ** HELPER FUNCTIONS **
  
  // connects users by adding a row to the users_users table
  // the confirmed_at column will be null, showing that the relationship has not been
  // confirmed by the secondary user yet
  var connectUsers = function(timestamp, primaryUserId, secondaryUserId) {
    db.run(
    'INSERT INTO users_users (created_ga, primary_user_id, secondary_user_id) ' +
    'VALUES ($1, $2, $3)', 
    [timestamp, primaryUserId, secondaryUserId], 
    function(err, data) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log('Connected primaryUserId: ' + primaryUserId + 
          ', to secondaryUserId: ' + secondaryUserId);
        res.status(201);
        res.send(req.body);
      }
    }); 
  };
  
  // runs callback1 if a connection exists between a primary user and a secondary user;
  // runs callback2 if the connection does not exist
  var checkConnectionOneWay = function(primaryUserId, secondaryUserId, callback1, callback2) {

      // find all users from connections with the passed in primary user as the primary user
    db.run(
      ('SELECT u.id, u.username, u.email ' + 
      'FROM users_users uu ' +
      'INNER JOIN users u ' +
      'ON u.id = uu.secondary_user_id ' +
      'WHERE uu.primary_user_id =($1)'), 
      [primaryUserId],
      function(err, data) {
        if (err) {
          res.status(500).send(err);
          console.error(err);
        } else {
          // if any of the users found are this secondary user, set connected to true
          var connected = false;
          for (var i = 0; i < data.length; i++) {
            if (data[i].id === parseInt(secondaryUserId)) {
              connected = true;
              break;
            } 
          }
          if (connected) {
            callback1();
          } else {
            callback2();
          }
        }
      });        
  };
  
  // runs callback1 if a connection exists between a two users in either direction;
  // runs callback2 if the connection does not exist
  var checkConnectionBothWays = function(primaryUserId, secondaryUserId, callback1, callback2) {
    checkConnectionOneWay(primaryUserId, secondaryUserId, callback1,
      checkConnectionOneWay.bind(null, secondaryUserId, primaryUserId, callback1, callback2),
    callback2);
  };
  
  // ** BUSINESS LOGIC FOR POST REQUEST **
  
  // check if the secondary user exists
  db.run(
  'SELECT * FROM users WHERE id=($1)',
  [secondaryUserId],
  function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } 
    // if the secondary user exists
    if (data.length > 0) {
      // if the connection does not exist, add it
      checkConnectionBothWays(primaryUserId, secondaryUserId, () => {
        console.log('Users are already connected');
        res.status(200);
        res.send(req.body);
      }, connectUsers.bind(null, timestamp, primaryUserId, secondaryUserId)); 
    } else {
      // if secondary user doesn't exist, add to users table with signed_up = false
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
            // once the secondary user exists, add a connection
            connectUsers(timestamp, primaryUserId, secondaryUserId);
          }
        }); 
    }
  });
};


// PATCH at /api/v1/users/:id/friends 
// to confirm or end a relationship
exports.confirmOrRemoveFriend = function(req, res) {
  console.log('in confirmOrRemoveFriend');
  // this is the person accepting the invitation to compete
  var secondaryUserId = req.params.id; 
  // this is the person who sent the invitation to compete
  var primaryUserId = req.body.primaryUserId;
  
  var status = new Date();
  // if removeFriend = true, replace status with null 
  if (req.body.removeFriend) {
    status = null;
  } 
  // find user_users connection
  db.run(
    ('SELECT * ' + 
    'FROM users_users uu ' +
    'WHERE uu.primary_user_id=($1) ' +
    'AND uu.secondary_user_id=($2)'), 
    [primaryUserId, secondaryUserId],
    function(err, data) {
      if (err) {
        console.error(err);
        res.send(500);
      } else {
      // if there is no connection, send 404
        if (data.length === 0) {
          res.send(404);
        } else {
          db.run(
            ('UPDATE users_users uu ' + 
            'SET confirmed_at =($1) ' +
            'WHERE uu.primary_user_id=($2) ' +
            'AND uu.secondary_user_id=($3)'), 
            [status, primaryUserId, secondaryUserId], 
            function (err, data) {
              if (err) {
                console.error(err.message);
                res.status(500).send(err);
              } else {
                console.log('primaryUserId.');
                res.status(201).send(req.body);
              }
            });
        } 
      }
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
