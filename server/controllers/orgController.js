const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// PATCH at /api/v1/orgs/:id/orgs
exports.retrieveOrgs = (req, res) => {
  const queryId = req.params.id;
  const username = req.body.profile.username;
  const token = req.body.token;
  const dbTimestamp = pgp.as.date(new Date());
  var orgCount = 0;
  var orgsSoFar = 0; 
  // *** HELPER FUNCTIONS ***
  
  // get all of this user's orgs from GitHub
  var getOrgsFromGitHub = (username, callback) => {
    var options = {
      url: 'https://api.github.com/user/orgs',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('getOrgsFromGitHub error');
      } else {
        var orgs = JSON.parse(body);
        callback(username, orgs);
      }
    });
  };
  
  const addOrgsToDb = (orgs, callback) => {
    db.tx(task => {
      const queries = orgs.map(org => {
        // increment counter for each org
        orgCount++;
        return task.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~) ' +
          'VALUES ($7, $8, $9, $10) ' +
          'ON CONFLICT ($3~) ' +
          'DO UPDATE SET ($4~, $5~, $6~) = ($8, $9, $10) ' +
          'WHERE $2~.$3~ = $7',
          ['orgs', 'o', 'id', 'orgname', 'avatar_url', 'updated_ga',
          org.id, org.login, org.avatar_url, dbTimestamp]);
      });
      return task.batch(queries);
    })
    .then(data => {
      callback();
    })
    .catch(error => {
      console.error('addOrgsToDb error');
    });
  };

  // add a join for each org to our user_orgs table, associating each org with a user
  var addUserOrgJoins = (orgs, callback) => {
    db.tx(task => {
      var queries = orgs.map(org => {
        return task.any('INSERT INTO $1~ ($2~, $3~, $4~) ' +
        'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
        '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
        ['users_orgs', 'created_ga', 'user_id', 'org_id',
        dbTimestamp, queryId, org.id]);
      });
      return task.batch(queries);
    })
    .then(data => {
      callback();
    })
    .catch(error => {
      console.error('addUserOrgJoins error');
    });
  };


  // get all of an org's repos from GitHub
  var getReposFromGitHub = (username, orgs, callback) => {
    orgs.forEach(function(org, index, body) {
      // get the repos for each of this user's orgs
      var options = {
        url: 'https://api.github.com/orgs/' + org.login + '/repos',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': username,
          'Authorization': `token ${req.body.token}`
        }
      };
      request(options, (error, response, body) => {
        if (error) {
          console.error('getReposFromGitHub error');
        } else {
          var repos = JSON.parse(body);
          callback(repos, org);
        }
      });
    });
  };  
  
  const addReposToDb = (repos, org) => {
    db.tx(task => {
      const queries = repos.map(repo => {
        return task.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~, $9~, $10~) ' +
          'VALUES ($11, $12, $13, $14, $15, $16, $17, $18) ' +
          'ON CONFLICT ($3~) ' +
          'DO UPDATE SET ($5~, $6~, $7~, $8~, $9~, $10~) = ($13, $14, $15, $16, $17, $18) ' +
          'WHERE $2~.$3~ = $11',
          ['repos', 'r', 'id', 'created_at', 'updated_ga', 'name', 'owner', 'watchers_count', 'stargazers_count', 'forks_count',
          repo.id, repo.created_at, dbTimestamp, repo.name, repo.owner.id, repo.watchers_count, repo.stargazers_count, repo.forks_count]);
      });
      return task.batch(queries);
    })
    .then(data => {
      addOrgRepoJoins(repos, org, patchOrgsResponse);
    })
    .catch(error => {
      console.error('addReposToD error: ', error);
    });
  };
  
  // add a join for each repo to our orgs_repos table, associating each repo to an org
  var addOrgRepoJoins = (repos, org, callback) => {
    db.tx(task => {
      var queries = repos.map(repo => {
        console.log('in addOrgRepoJoins, repo.id', repo.id);
        console.log('in addOrgRepoJoins, org.id', org.id);
        
        return task.oneOrNone('INSERT INTO $1~ ($2~, $3~, $4~) ' +
        'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
        '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
        ['orgs_repos', 'created_ga', 'org_id', 'repo_id',
        dbTimestamp, org.id, repo.id]);
      });
      return task.batch(queries);
    })
    .then(data => {
      callback(data);
    })
    .catch(error => {
      console.error('addOrgRepoJoins error: ', error);
    });
  };


  // send the response for the api endpoint, containing all this user's orgs
  var patchOrgsResponse = () => {
    db.any(('SELECT o.id, o.updated_ga, o.orgname, o.avatar_url, o.followers, o.following, o.score ' +
      'FROM users_orgs uo ' +
      'INNER JOIN orgs o ' +
      'ON o.id = uo.org_id ' +
      'WHERE uo.user_id=$1'), [queryId])
    .then(data => {
    // increment counter for each org that has been fully processed
      orgsSoFar ++;
      if (orgsSoFar === orgCount) {
        res.send(data);
      }
    })
    .catch(error => {
      console.error('patchOrgsResponse error');
      res.status(500).send('Error querying orgs table');
    });
  };
  
  
  // *** CALL HELPER FUNCTIONS ***

  const handleGitHubData = (username, orgs) => {
    addOrgsToDb(orgs, 
      addUserOrgJoins.bind(null, orgs, 
        getReposFromGitHub.bind(null, username, orgs, 
          addReposToDb)));
  };
  
  getOrgsFromGitHub(username, handleGitHubData);
};

// '/github/:username/orgs'
exports.retrieveAllOrgsForUser = function(req, res) {
  db.any('SELECT o.orgname, o.avatar_url FROM orgs o INNER JOIN users_orgs uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users u on (uo.user_id=u.id) WHERE u.username=$1', [req.params.username])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading orgs table');
    });
};

// '/:orgname/stats'
exports.retrieveStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:orgname/achievements'
exports.retrieveAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};
