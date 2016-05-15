const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;


// GET at '/api/v1/users/:id/stats' to get a user's stats
// the headers must include the 'orgid' and 'repoid'
exports.retrieveStats = function(req, res) {
  var queryId = req.params.id;
  db.any('SELECT * FROM $1~ $2~' +
    'WHERE $2~.$3~=$4 ' +
    'AND $2~.$5~=$6 ' +
    'AND $2~.$7~=$8',
    ['stats', 's', 'user_id', queryId, 'repo_id', req.headers.repoid, 'org_id', req.headers.orgid])
    .then(stats => {
      res.send(stats);
    })
    .catch(error => {
      console.error('Error selecting stats: ', error);
    });
};

// PATCH at '/api/v1/users/:id/stats' to update stats 
exports.updateStats = function(req, res) {
  var queryId = req.params.id;
  var dbTimestamp = pgp.as.date(new Date());
  
  // ** HELPER FUNCTIONS **
  
  // delete existing stats from database
  var deleteStatFromDb = function(combo, repo, stat, callback) {
    db.any('DELETE FROM $1~ ' +
      'WHERE $2~ = $3 ' +
      'AND $4~ = $5 ' +
      'RETURNING *',
      ['stats', 'org_id', combo.orgId, 'repo_id', repo.repoId])
      .then(data => {
        callback(combo, repo, stat);
      })
      .catch(error => {
        console.error('Error in deleteStatFromDb: ', error);
      });
  };
  
  // send the stats from the database for this queryId
  var sendStatsFromDb = function() {
    db.any('SELECT * FROM $1~ $2~' +
      'WHERE $2~.$3~=$4',
      ['stats', 's', 'user_id', queryId])
      .then(stats => {
        console.log('Successfully parsed stats for ' + totalStats + ' repos');
        res.send(stats);
      })
      .catch(error => {
        console.error('Error in retrieveStats: ', error);
      });
  };
  
  // save stat to database
  var saveStatToDb = function(combo, repo, stat) {
    // if this stat's author matches the queryId, add it to the database
    if (stat.author.id === parseInt(queryId)) {
      db.any('INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~, $7~) ' +
        'VALUES ($8, $9, $10, $11, $12, $13)',
        ['stats', 'updated_ga', 'total', 'weeks', 'user_id', 'org_id', 'repo_id',
        dbTimestamp, stat.total, stat.weeks, stat.author.id, combo.orgId, repo.repoId])
        .then(data => {
          statsSaved++;
          // if this was the last stat to be processed, send the server response
          if (statsSaved === totalStats) {
            sendStatsFromDb();
          }
        })
        .catch(error => {
          console.error('Error in saveStatsToDb: ', error);
        });
    } else {
      statsSaved++;
      // if this was the last stat to be processed, send the server response
      if (statsSaved === totalStats) {
        sendStatsFromDb();
      }
    }
  };
  
  //  get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(username, combo, repo, callback) {
    var options = {
      url: 'https://api.github.com/repos/' + combo.orgName + '/' + repo.repoName + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        'Authorization': `token ${req.body.token}`
        // Uncomment this line to make GET requests from Postman
        // 'Authorization': 'token ' + token
      }
    };
    request(options, (error, response, stats) => {
      if (error) {
        console.error('Error in getStatsFromGitHub: ', error);
      } else {
        var statsArray = JSON.parse(stats);
        if (Array.isArray(statsArray)) {
          statsArray.forEach((stat) => {
            deleteStatFromDb(combo, repo, stat, saveStatToDb);
          });
        }
      }
    });
  };
  
  // ** BUSINESS LOGIC FOR PATCH REQUEST **
  
  // this will store the combinations of every orgname and repo name that we want to query GitHub for
  var statCombos = [];
  var totalStats = 0;
  var statsSaved = 0;
  // retrieve this user's username
  db.one('SELECT * ' +
    'FROM $2~ ' +
    'WHERE $3~=$4',
    ['username', 'users', 'id', queryId])
    .then(user => {
      console.log('Stats Step 1: user: ', user);
      const username = user.username;
      // select all of this user's orgs
      db.any('SELECT o.id, o.updated_ga, o.orgname, o.avatar_url, o.followers, o.following, o.score ' + 
        'FROM users_orgs uo ' +
        'INNER JOIN orgs o ' + 
        'ON o.id = uo.org_id ' + 
        'WHERE uo.user_id=$1', 
        [queryId])
        .then(orgs => {
          console.log('Stats step 1: orgs: ', orgs);
          // find the repos associated with each org
          var orgsLeft = orgs.length;
          // if there are no orgs, send empty response
          if (orgsLeft = 0) {
            console.log('No orgs, sending empty response');
            res.send();
          } else {
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
                // assemble all the combinations of each org with its repos
                .then(repos => {
                  var reposLeft = repos.length;
                  repos.forEach((repo, index, repos) => {
                    statCombo.repos.push({repoName: repo.name, repoId: repo.id});
                    reposLeft--;
                    if (reposLeft === 0) {
                      statCombos.push(statCombo);
                      orgsLeft--;
                      if (orgsLeft === 0) {
                        statCombos.forEach((combo) => {
                          totalStats += combo.repos.length;
                        });
                        // once the combinations are set up, get the stats for each
                          // the getStatsFromGitHub will use a callback to delete existing stats
                          // and save updated stats
                        statCombos.forEach((combo) => {
                          combo.repos.forEach((repo) => {
                            getStatsFromGitHub(username, combo, repo, deleteStatFromDb);
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
          }
        })
        .catch(error => {
          res.status(500).send();
          console.error('Error selecting orgs: ', error);
        });  
    })
    .catch(error => {
      res.send(500);
      console.error('Error retrieving username: ', error);
    });

};
