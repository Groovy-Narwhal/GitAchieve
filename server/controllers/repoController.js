const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;

// PATCH at '/api/v1/users/:id/repos'
exports.retrieveRepos = function(req, res) {
  var queryId = req.params.id;
  var queryUsername = req.body.profile.username;
  var dbTimestamp = pgp.as.date(new Date());
  
  // ** HELPER FUNCTIONS **
  
  // add an array of repos to our repos table
  var addReposToDb = function(repos, callback) {
    // db.tx is a 'transaction' - it allows you to execute several commands on one connection
    db.tx(function (task) {
      var queries = repos.map(function (repo) {
        // this is an 'upsert' - it will insert a record if it does not exist, or update it if it exists
        return task.any('INSERT INTO $1~ AS $16~ ($2~, $3~, $4~, $5~, $6~, $7~, $8~) ' +
          'VALUES ($9, $10, $11, $12, $13, $14, $15) ' +
          'ON CONFLICT ($2~) ' + 
          'DO UPDATE SET ($3~, $4~, $5~, $6~, $7~, $8~) = ($10, $11, $12, $13, $14, $15) ' +
          'WHERE $16~.$2~ = $9',
          ['repos', 'id', 'updated_ga', 'created_at', 'watchers_count', 'stargazers_count', 'forks_count', 'name',
          repo.id, dbTimestamp, repo.created_at, repo.watchers_count, repo.stargazers_count, repo.forks_count, repo.name, 'r']);
      });
      return task.batch(queries);
    })
    .then(function (data) {
      console.log('Successfully added repos');
      callback();
    })
    .catch(function (error) {
      console.log('addReposToDb error');
      console.error(error);
    });  
    
  };
  
  // add a join for each repo to our users_repos table, associating each repo with a user  
  var addJoinsToDb = function(repos, callback) {
    db.tx(function (task) {
      var queries = repos.map(function (repo) {
        // only add a join row if it doesn't exist already
        return task.any('INSERT INTO $1~ ($2~, $3~, $4~) ' +
          'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
          '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
          ['users_repos', 'created_ga', 'repo_id', 'user_id',
          dbTimestamp, repo.id, queryId]);
      });
      return task.batch(queries);
    })
    .then(function (data) {
      console.log('Successfully added users_repos joins');
      callback();
    })
    .catch(function (error) {
      console.log('Add users_repos join error');
      console.error(error);
    });     
    
  };
  
  // sends the response for this API endpoint, containing all this user's repos
  var patchReposResponse = function () {
    db.any(('SELECT r.id, r.updated_ga, r.created_at, r.watchers_count, r.stargazers_count, r.forks_count ' + 
      'FROM users_repos ur ' +
      'INNER JOIN repos r ' + 
      'ON r.id = ur.repo_id ' + 
      'WHERE ur.user_id=$1'), 
      [queryId])
      .then((data) => res.send(data))
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error querying repos table');
      });
  };
  
  // get the user's repos from GitHub
  var getReposFromGitHub = function(username, callback) {
    var options = {
      url: 'https://api.github.com/users/' + username + '/repos',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        'Authorization': `token ${req.body.token}`
        // 'Authorization': 'token ' + token
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        callback(body);
      }
    });
  };
  
  // gather the helper functions together into one asynchronous series
  var handleGitHubData = function(data) {
    var repos = JSON.parse(data);
    addReposToDb(repos, addJoinsToDb.bind(null, repos, patchReposResponse));
  };
  
  // CALL HELPER FUNCTIONS
  getReposFromGitHub(queryUsername, handleGitHubData);
  
};  
  
// POST at '/api/v1/users/:id/repos'  
exports.addRepo = function(req, res) {
  var queryId = req.params.id;
  var dbTimestamp = pgp.as.date(new Date());
  
  db.tx(t => {
    // save query to add a repo with upsert (update or insert)
    var q1 = t.any(
      'INSERT INTO $1~ AS $16~ ($2~, $3~, $4~, $5~, $6~, $7~, $8~) ' +
      'VALUES ($9, $10, $11, $12, $13, $14, $15) ' +
      'ON CONFLICT ($2~) ' + 
      'DO UPDATE SET ($3~, $4~, $5~, $6~, $7~, $8~) = ($10, $11, $12, $13, $14, $15) ' +
      'WHERE $16~.$2~ = $9',
      ['repos', 'id', 'updated_ga', 'created_at', 'watchers_count', 'stargazers_count', 'forks_count', 'name',
      req.body.profile.id, dbTimestamp, req.body.profile.created_at, req.body.profile.watchers_count, req.body.profile.stargazers_count, req.body.profile.forks_count, req.body.profile.name, 'r']);
    
    // save query to add a users_repo join 
    var q2 = t.any(
      'INSERT INTO $1~ ($2~, $3~, $4~) ' +
      'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
      '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7) ',
      ['users_repos', 'created_ga', 'repo_id', 'user_id',
      dbTimestamp, req.body.profile.id, queryId]); 
    
    // call both queries
    return t.batch([q1, q2]);
  })
  .then(data => {
    console.log('repo added to database');
    res.send(req.body.profile);
  })
  .catch(error => {
    console.log('error:', error);
    res.status(500).send('Error inserting to repos table');
  });
};  
