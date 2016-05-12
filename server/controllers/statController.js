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
  var dbTimestamp = pgp.as.date(new Date());
  
  // ** HELPER FUNCTIONS **
  
  //  get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(username, combo, repo, callback) {
    console.log('combo.orgName', combo.orgName);
    console.log('repo.repoName', repo.repoName);
    var options = {
      url: 'https://api.github.com/repos/' + combo.orgName + '/' + repo.repoName + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        // 'Authorization': `token ${req.body.token}`
        'Authorization': 'token ' + token
      }
    };
    
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        console.log('success in getStats, stats.length: ', stats.length);
        
        // START HERE - stats is an array; callback needs to happen for each element
        
        // callback(combo, repo, stats);
      }
    });
  };
  
  // delete existing stats from database
  var deleteStatsFromDb = function(combo, repo, stats) {
    
    db.any('DELETE FROM $1~ ' +
      'WHERE $2~ = $3 ' +
      'AND $4~ = $5 ' +
      'RETURNING *',
      ['stats', 'org_id', combo.orgId, 'repo_id', repo.repoId])
      .then(data => {
        console.log('successful deleteStatsFromDb, data: ', data);
        saveStatsToDb(combo, repo, stats);
      })
      .catch(error => {
        console.error('error in deleteStatsFromDb: ', error);
      });
  };
  
  // save stats to database
  var saveStatsToDb = function(combo, repo, stats) {
    db.one('INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~, $7~) ' +
      'VALUES ($8, $9, $10, $11, $12, $13)',
      ['stats', 'updated_ga', 'total', 'weeks', 'user_id', 'org_id', 'repo_id',
      dbTimestamp, stats.total, stats.weeks, queryId, combo.orgId, repo.repoId])
      .then(data => {
        console.log('successful saveStatsToDb, data: ', data);
      })
      .catch(error => {
        console.error('error in saveStatsToDb: ', error);
      });
  };
  
  // ** BUSINESS LOGIC FOR PATCH REQUEST **
  
  // this will store the combinations of every orgname and repo name that we want to query GitHub for
  var statCombos = [];
  // retrieve this user's username
  db.one('SELECT * ' +
    'FROM $2~ ' +
    'WHERE $3~=$4',
    ['username', 'users', 'id', queryId])
    .then(user => {
      const username = user.username;
      // select all of this user's orgs
      db.any('SELECT o.id, o.updated_ga, o.orgname, o.avatar_url, o.followers, o.following, o.score ' + 
        'FROM users_orgs uo ' +
        'INNER JOIN orgs o ' + 
        'ON o.id = uo.org_id ' + 
        'WHERE uo.user_id=$1', 
        [queryId])
        .then(orgs => {
          // find the repos associated with each org
                              
          var orgsLeft = orgs.length;
          orgs.forEach((org, index, orgs) => {
            var statCombo = {};
            statCombo.orgName = org.orgname;
            statCombo.orgId = org.id;
            statCombo.repos = [];
            db.any('SELECT r.id, r.name ' + 
              'FROM orgs_repos ogr ' +
              'INNER JOIN repos r ' + 
              'ON r.id = ogr.repo_id ' + 
              'WHERE ogr.org_id=$1', 
              [org.id])
              .then(repos => {
                var reposLeft = repos.length;
                repos.forEach((repo, index, repos) => {
                  statCombo.repos.push({repoName: repo.name, repoId: repo.id});
                  reposLeft--;
                  if (reposLeft === 0) {
                    statCombos.push(statCombo);
                    orgsLeft--;
                    if (orgsLeft === 0) {
                      console.log('statCombos', statCombos);
                      statCombos.forEach((combo) => {
                        combo.repos.forEach((repo) => {
                          getStatsFromGitHub(username, combo, repo, deleteStatsFromDb);
                        });                            
                      });
                    }  
                  }
                });
              })
              .catch(error => {
                console.error('Error in orgs.forEach: ', error);
              });
          });
          
        })
        .catch(error => {
          res.status(500).send();
          console.error('error: ', error);
        });  
    })
    .catch(error => {
      res.send(500);
      console.error('error: ', error);
    });

};
