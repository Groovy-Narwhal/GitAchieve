const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const gitHubMiner = require('../helpers/gitHubMiner');

// GET at /api/v1/users
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
      res.status(500).send('Error searching database for user');
    });
};

// PATCH at '/api/v1/users/:id'
exports.updateUser = function(req, res) {
  var queryId = req.params.id;
  // first, find the user by id
  db.one('SELECT * FROM users WHERE id=$1', queryId)
    .then((data) => {
      // if there is a matching user, set up keyCount to determine when to respond
      var keyCount = 0;
      for (var key in req.body) {
      // if a key in the request body doesn't exist, send error 
        if (data[key] === undefined) {
          res.status(500).send('You are trying to update the user.' + key + ' property, which doesn\'t exist');
        } else {
          // otherwise, increment key count
          keyCount++;
        }
      }
      // copy user into an object called updatedUser
      var updatedUser = data;
      // for each key:value pair in the request body
      for (var key in req.body) {
        // update the updatedUser
        updatedUser[key] = req.body[key];
        // and update the database
        db.any(
          'UPDATE users SET ' + key + 
          '=$1 WHERE id=$2', 
          [req.body[key], queryId]) 
          .then((data) => {
            keyCount --;
            // when there are no more keys left
            if (keyCount === 0) {
              // send the updated user back
              res.send(updatedUser);
            }
          })
          .catch((error) => {
            console.error(error);
            res.send(500);
          });
      }
    })
  .catch((error) => {
    // if the user was not found, send 404
    if (error.code === 0) {
      res.status(404).send('User does not exist');
    } else {
      console.error(error);
      res.status(500).send('Error searching database for user');
    }
  });
};  

// DELETE at '/api/v1/users/:id'
exports.deleteUser = function(req, res) {
  var queryId = req.params.id;
  console.log('queryId', queryId);
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

// GET at '/api/v1/users/:id/repos'
exports.retrieveRepos = function(req, res) {
  var queryId = req.params.id;
  var queryUsername = req.body.username;

  var dbTimestamp = pgp.as.date(new Date());
  
  // START HERE: currently, this does not overwrite any records that already exist - it will send an error instead.
  // copy the approach used in gitHubMiner getOrAddUser
  // need to make it so that when two users are both part of a repo, they can both be added to the users_repos join table
  // currently, the second user will not be able to add the repo or the join row
  
  var addRepos = function(repos, callback) {
    db.tx(function (task) {
      var queries = repos.map(function (repo) {
        return task.none('INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~, $7~) VALUES ($8, $9, $10, $11, $12, $13)',
        ['repos', 'id', 'created_ga', 'created_at', 'watchers_count', 'stargazers_count', 'forks_count',
        repo.id, dbTimestamp, repo.created_at, repo.watchers_count, repo.stargazers_count, repo.forks_count]);
      });
      return task.batch(queries);
    })
    .then(function (data) {
      console.log('Successfully added repos');
      callback();
    })
    .catch(function (error) {
      console.error(error);
    });  
    
  };
    
  var addJoins = function(repos, callback) {
    repos.forEach(function(repo, index) {
      db.any('INSERT INTO $1~ ($2~, $3~, $4~) VALUES ($5, $6, $7)',
        ['users_repos', 'created_ga', 'repo_id', 'user_id', dbTimestamp, repo.id, queryId])
        .then(() => {
          if (index === repos.length - 1) {
            callback();
          }
        })
        .catch((error) => {
          console.error(error);
          // res.status(500).send('Error saving to users_repos join table');
        });
    });
  };
  
  var sendRepos = function () {
    db.any(('SELECT r.id, r.created_ga, r.created_at, r.watchers_count, r.stargazers_count, r.forks_count ' + 
      'FROM users_repos ur ' +
      'INNER JOIN repos r ' + 
      'ON r.id = ur.repo_id ' + 
      'WHERE ur.user_id=$1'), 
      queryId)
      .then((data) => res.send(data))
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error querying repos table');
      });
  };
  
  var handleGitHubData = function(data) {
    var repos = JSON.parse(data);
    var timestamp = new Date();
    addRepos(repos, addJoins.bind(null, repos, sendRepos));
  };
  
    // TO DO - change 'alexnitta' to queryUsername when done testing
  gitHubMiner.getRepos('alexnitta', handleGitHubData);
  
};  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
