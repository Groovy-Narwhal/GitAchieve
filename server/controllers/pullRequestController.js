var request = require('request');
var rp = require('request-promise');
var db = require('../db/database.js').db;
var pgp = require('../db/database.js').pgp;
var PORT = require('../config/config-settings').PORT;
var HOST = require('../config/config-settings').HOST;
var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// PATCH at '/api/v1/users/orgs/:id/pullrequests' to update a user's pull requests by user id
exports.retrievePullRequests = (req, res) => {
  var dbTimestamp = pgp.as.date(new Date());
  var username = req.body.profile.username;
  var queryId = req.params.id;

  // get the user from the database
  db.one('SELECT * FROM $1~ ' +
    'WHERE $2~ = $3',
    ['users', 'id', queryId])
    .then(user => {
      // find all orgs this user is part of
      db.any('SELECT o.id, o.orgname ' + 
        'FROM users_orgs uo ' +
        'INNER JOIN orgs o ' +
        'ON o.id = uo.org_id ' +
        'WHERE uo.user_id =($1)', 
        queryId)
        .then(orgs => {
        // find all repos for each org
          db.tx(t => {
            var queries = [];
            if (orgs.length > 0) {
              queries = orgs.map(org => {
                return t.any('SELECT r.id, r.owner_id, r.name ' + 
                  'FROM orgs_repos orp ' +
                  'INNER JOIN repos r ' +
                  'ON r.id = orp.repo_id ' +
                  'WHERE orp.org_id=($1)', 
                  org.id);
              });
            }
            return t.batch(queries);
          })
          .then(repos => {
            var orgRepoCombos = [];
            for (var i = 0; i < orgs.length; i++) {
              orgRepoCombos.push([orgs[i], repos[i]]);
            }
            // if there are no org / repo combinatinos, send back empty response
            if (orgRepoCombos.length === 0) {
              res.send([]);
            } else {
              // orgRepoCombos is an array of combos
              // the first element in each combo is the org, the second element is an array of repos
              var repoOwners = orgRepoCombos.reduce((acc, curr) => {
                for (var i = 0; i < curr[1].length; i++) {
                  // if the org id = the repo's owner_id, the repo owner is the orgname
                  if (curr[0].id === curr[1][i].owner_id) {
                    acc.push({repoName: curr[1][i].name, owner: curr[0].orgname});  
                  } else {
                  // if not, the repo owner is the username
                    acc.push({repoName: curr[1][i].name, owner: user.username});
                  }
                }
                return acc;
              }, []);
              
              // set up final result and counters 
              var repoOwnersCount = 0;
              var totalRepoOwners = repoOwners.length;
              var updatedPullRequests = []; 
              // call to send final response
              var sendUpdatedPullRequests = function() {
                db.one('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~) ' +
                  'VALUES ($6, $7, $8) ' +
                  'ON CONFLICT ($3~) ' +
                  'DO UPDATE SET ($4~) = ($7) ' +
                  'WHERE $2~.$3~ = $6 ' +
                  'RETURNING *',
                  ['users', 'u', 'id', 'pull_requests_count', 'created_ga',
                  queryId, updatedPullRequests.length, dbTimestamp])
                  .then(user => {
                    res.send(updatedPullRequests);
                  })
                  .catch(error => {
                    console.error('Error updating pull_requests_count: ');
                    // res.status(500).send('Error updating pull_requests_count');
                  });
              };
              
              // get the pull requests from GitHub for each repo (using the owner name)
              repoOwners.forEach(repo => {
                var options = {
                  uri: `https://api.github.com/repos/${repo.owner}/${repo.repoName}/pulls?state=all`,
                  headers: {
                    'User-Agent': user.username,
                    // Uncomment this line to make GET requests from within the site (not with Postman)
                    'Authorization': `token ${req.body.token}`
                    // Uncomment this line to make GET requests from Postman
                    // 'Authorization': 'token ' + token
                  },
                  json: true
                };
                rp(options)
                  .then(pullRequests => {
                  // save all pull requests to DB that have the user id as the head.user.id
                    if (pullRequests.length === 0) {
                      repoOwnersCount++;
                      if (repoOwnersCount === totalRepoOwners) {
                        sendUpdatedPullRequests();
                      }
                    } else {
                      var filteredPullRequests = [];
                      pullRequests.forEach((pr) => {
                        if (pr.head.user.id === user.id) {
                          filteredPullRequests.push(pr);
                        }
                      });
                      db.tx(t => {
                        var queries = filteredPullRequests.map(pr => {
                          return t.any('INSERT INTO $1~ as $2~ ($3~, $4~, $5~, $6~, $7~, $8~, ' +
                            '$9~, $10~, $11~, $12~, $13~, $14~) ' +
                            'VALUES ($15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) ' +
                            'ON CONFLICT ($3~) ' +
                            'DO UPDATE SET ($4~, $5~, $6~, $7~, $8~, ' +
                            '$9~, $10~, $11~, $12~, $13~, $14~) = ' +
                            '($16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) ' +
                            'WHERE $2~.$3~ = $15 ' +
                            'RETURNING *',
                            ['pull_requests', 'pr', 'id', 'updated_ga', 'user_id', 'state', 
                            'diff_url', 'created_at', 'merged_at', 'closed_at', 'milestone', 
                            'base_ref', 'base_repo_watchers_count', 'base_repo_stargazers_count',
                            pr.id, dbTimestamp, pr.head.user.id, pr.state,
                            pr.diff_url, pr.created_at, pr.merged_at, pr.closed_at, pr.milestone, 
                            pr.base.ref, pr.base.repo.watchers_count, pr.base.repo.stargazers_count]);
                        });
                        return t.batch(queries);
                      })
                      .then(prs => {
                        updatedPullRequests.push(prs);
                        repoOwnersCount++;
                        if (repoOwnersCount === totalRepoOwners) {
                          sendUpdatedPullRequests();
                        }
                      })
                      .catch(error => {
                        console.error('Error updating pull requests: ');
                        // res.status(500).send('Error updating pull requests');
                      });
                    } // end of else block
                  })  
                  .catch(error => {
                    console.error('Error getting pull requests from GitHub: ');
                    // res.status(500).send('Error getting pull requests from GitHub');
                  });
              });  
            } 
          })
          .catch(error => {
            console.error('Error in selecting repos: ');
            // res.status(500).send('Error in selecting repos');
          });
        })
        .catch(error => {
          console.error('Error in selecting orgs: ');
          // res.status(500).send('Error in selecting orgs');
        });
    })
    .catch(error => {
      console.error('Error in selecting user: ');
      // res.status(500).send('Error in selecting user');
    });
};


// /api/v1/users/orgs/:id/pullrequests
exports.retrieveAllPRSForUser = function(req, res) {
  var id = req.params.id;
  console.log('id', id);
  db.any('SELECT * FROM pull_requests WHERE pull_requests.user_id=$1 AND pull_requests.closed_at IS NOT NULL', [id])
    .then(data => res.send(data))
    .catch(error => {
      console.error('Error reading pull_requests table:');
      // res.status(500).send('Error reading pull_requests table');
    });
};
