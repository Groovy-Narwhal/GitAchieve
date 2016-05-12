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
  
  // delete existing stats from database
  var deleteStatFromDb = function(combo, repo, stat, callback) {
    db.any('DELETE FROM $1~ ' +
      'WHERE $2~ = $3 ' +
      'AND $4~ = $5 ' +
      'RETURNING *',
      ['stats', 'org_id', combo.orgId, 'repo_id', repo.repoId])
      .then(data => {
        callback(combo, repo, stat);
        console.log('successful deleteStatFromDb');
      })
      .catch(error => {
        console.error('error in deleteStatFromDb: ', error);
      });
  };
  
  // save stat to database
  var saveStatToDb = function(combo, repo, stat) {
    db.any('INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~, $7~) ' +
      'VALUES ($8, $9, $10, $11, $12, $13)',
      ['stats', 'updated_ga', 'total', 'weeks', 'user_id', 'org_id', 'repo_id',
      dbTimestamp, stat.total, stat.weeks, queryId, combo.orgId, repo.repoId])
      .then(data => {
        console.log('successful saveStatsToDb');
      })
      .catch(error => {
        console.error('error in saveStatsToDb: ', error);
      });
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
        // 'Authorization': `token ${req.body.token}`
        'Authorization': 'token ' + token
      }
    };
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        var statsArray = JSON.parse(stats);
        statsArray.forEach((stat) => {
          deleteStatFromDb(combo, repo, stat, saveStatToDb);
        });
      }
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
