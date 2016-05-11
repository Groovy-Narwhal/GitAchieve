const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;

// GET at '/api/v1/user/:id/stats'
exports.retrieveStats = function(req, res) {
  var queryId = req.params.id;
  
};

// POST at '/api/v1/user/:id/stats'
exports.addStats = function(req, res) {
  var queryId = req.params.id;
};

// PATCH at '/api/v1/user/:id/stats' to update stats 
exports.updateStats = function(req, res) {
  var queryId = req.params.id;
  
  // ** HELPER FUNCTIONS **
  
  //  get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(orgname, repo, callback) {
    var options = {
      url: 'https://api.github.com/repos/' + orgname + '/' + repo.name + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': orgname,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        // 'Authorization': `token ${req.body.token}`
        'Authorization': 'token ' + token
      }
    };
    
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        console.log('success in getStats');
        callback(orgname, repo, stats);
      }
    });
  };
  
  // ** BUSINESS LOGIC FOR PATCH REQUEST **
  
  // retrieve this user's username
  db.one('SELECT * ' +
    'FROM $2~ ' +
    'WHERE $3~=$4',
    ['username', 'users', 'id', queryId])
  .then(user => {
    console.log('user', user);
    // select all of this user's repos
    db.any('SELECT r.id, r.updated_ga, r.created_at, r.watchers_count, r.stargazers_count, r.forks_count ' + 
      'FROM users_repos ur ' +
      'INNER JOIN repos r ' + 
      'ON r.id = ur.repo_id ' + 
      'WHERE ur.user_id=$1', 
      [queryId])
      .then(repos => {
        console.log(repos);
        // find the org (if any) associated with each repo
        db.tx(function(t) {
          var queries = repos.map(function (repo) {
            return t.oneOrNone('SELECT o.id, o.updated_ga, o.orgname, o.avatar_url, o.followers, o.following, o.score ' + 
              'FROM orgs_repos ogr ' +
              'INNER JOIN orgs o ' + 
              'ON o.id = ogr.repo_id ' + 
              'WHERE ogr.repo_id=$1', 
              [repo.id]);
          });
          return t.batch(queries);
        })
        .then(orgs => {
          console.log('orgs[0]', orgs[0]);
          res.send('success');
        })
        .catch(error => {
          console.error('error: ', error);
          res.send(500);
        });
        // for each org / repo pair, get the stats from GitHub
      })
      .catch(error => {
        res.send(500);
        console.error('error: ', error);
      });  
  })
  .catch(error => {
    res.send(500);
    console.error('error: ', error);
  });

};
