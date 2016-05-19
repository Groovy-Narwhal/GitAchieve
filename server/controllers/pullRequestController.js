const request = require('request');
const rp = require('request-promise');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// PATCH at '/api/v1/users/orgs/:id/pullrequests'

exports.retrievePullRequests = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
  const username = req.body.profile.username;
  const queryId = req.params.id;
  
  db.one('SELECT * FROM $1~ ' +
    'WHERE $2~ = $3',
    ['users', 'id', queryId])
    .then(user => {
      console.log('user', user);
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
            if (orgRepoCombos.length === 0) {
              res.send('No repos found for this user\'s orgs');
            } else {
              // orgRepoCombos is an array of combos
              // the first element in each combo is the org, the second element is an array of repos
              var repoOwners = orgRepoCombos.reduce((acc, curr) => {
                for (var i = 0; i < curr[1].length; i++) {
                  // if the org id = the repo's owner_id, the repo owner is the orgname
                  if (curr[0].id === curr[1][i].owner_id) {
                    acc.push({repoName: curr[1][i].name, owner: curr[0].orgname});  
                  } else {
                    acc.push({repoName: curr[1][i].name, owner: user.username});
                  }
                }
                return acc;
                // if not, the repo owner is the username
              }, []);
              // get the pull requests from GitHub for each repo (using the owner name)
              var repoTotal = repoOwners.length;
              var repoCount = 0;
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
                  // save all pull requests to DB that have the user as the head : user
                    if (pullRequests.length === 0) {
                      repoCount++;
                    } else {
                      var filteredPullRequests = [];
                      pullRequests.forEach((pr) => {
                        if (pr.head.user.id === user.id) {
                          filteredPullRequests.push(pr);
                        }
                      });
                      
                      if (filteredPullRequests.length > 0) {
                        filteredPullRequests.forEach({
                          // START HERE: with the filtered pull requests, save each one to db
                          // once all have been added, increment repoCount to make sure res is sent
                          // at the end
                        });
                      }
                    }
                    
                    if (repoCount === repoTotal) {
                      res.send('success');
                    }
                        
                  })  
                  .catch(error => {
                    console.error('Error getting pull requests from GitHub: ', error);
                  });
              });  
            } 
          })
          .catch(error => {
            console.error('Error in selecting repos: ', error);
          });
        })
        .catch(error => {
          console.error('Error in selecting orgs: ', error);
        });
    })
    .catch(error => {
      console.error('Error in selecting user: ', error);
    });
};


exports.retrievePullRequests2 = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
  const username = req.body.profile.username;
  const id = req.params.id;
  var orgCount = 0;
  var totalOrgs = 0;
  // helper functions
  const addPR = (prs, totalRepos, repoCount) => {
    
    var pullRequestsTotal = prs.length;
    var pullRequestsCount = 0;
    
    var resCreator = function() {
      pullRequestsCount++;
      if (pullRequestsCount === pullRequestsTotal) {
        repoCount++;
      }
      if (repoCount === totalRepos) {
        orgCount++;
        console.log('pullRequestsCount', pullRequestsCount);
        console.log('pullRequestsTotal', pullRequestsTotal);
        console.log('repo count: ', repoCount);
        console.log('total repos: ', totalRepos);
        console.log('orgs count: ', orgCount);
        console.log('total orgs: ', totalOrgs);
        console.log('---------');
      }
      if (orgCount === totalOrgs) {
        res.send('success');
      }
    };
    
    if (pullRequestsTotal === 0 && totalRepos === 0) {
      orgCount++;
    } else if (pullRequestsTotal === 0) {
      repoCount++;
      if (repoCount === totalRepos) {
        orgCount++;
      }
      if (orgCount === totalOrgs) {
        res.send('success');
      }
    } else {
      prs.forEach((pr, index) => {
        db.any('SELECT * FROM users WHERE users.id = ($1)', [pr.user.id])
          .then((users) => {
            db.any('SELECT COUNT(*) FROM users WHERE users.id = ($1)', [pr.user.id])
              .then((data) => {
                if (data[0].count === '0') {
                  resCreator();
                } else if (data[0].count === '1') {
                  db.any('INSERT INTO pull_requests AS pr (id, created_at, updated_ga, user_id, ' +
                    'state,diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, ' + 
                    'base_repo_stargazers_count) ' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                    'ON CONFLICT (id) ' +
                    'DO UPDATE SET (updated_ga, user_id, state, diff_url, closed_at, milestone, ' +
                    'base_ref, base_repo_watchers_count, base_repo_stargazers_count) = ' +
                    '($3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                    'WHERE pr.id = ($1) ' +
                    'RETURNING *',
                    [pr.id, dbTimestamp, dbTimestamp, pr.user.id, pr.state, pr.diff_url, pr.merged_at,
                    pr.milestone, pr.base.ref, pr.base.repo.watchers_count,
                    pr.base.repo.stargazers_count])
                    .then(pullRequest => {
                      resCreator();
                    })
                    .catch(error => {
                      console.error('Error in inserting pull requests: ', error);
                    });
                } 
              });
          })
          .catch(error => {
            console.error('ERROR:', error);
          });
      }); // end of prs.forEach
    }
  };


  const gotAllRepos = (data, owner, addPRCB) => {
    var totalRepos = data.length;
    var repoCount = 0;
    
    if (totalRepos === 0) {
      addPRCB([], totalRepos, repoCount);
    } else {
      data.forEach(repo => {
        var repoOptions = {
          url: `https://api.github.com/repos/${owner}/${repo.name}/pulls?state=all`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': username,
            'Authorization': `token ${req.body.token}`
          }
        };
        request(repoOptions, (error, response, body) => {
          if (error) {
            console.error('ERROR:', error);
          } else {
            var data = JSON.parse(body);
            addPRCB(data, totalRepos, repoCount);
          }
        });
      });
    }
  };


  const requestRepos = (orgname, gotAllReposCB) => {
    var options = {
      url: `https://api.github.com/orgs/${orgname}/repos`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('error2: ', error);
      } else {
        var data = JSON.parse(body);
        // console.log('data.length', data.length);
        gotAllReposCB(data, orgname, addPR);
      }
    });
  };


  const addMembers = (memberData, orgname, requestReposCB) => {
    db.tx(task => {
      var queries = [];
      if (memberData.length > 0) {
        queries = memberData.map(member => {
          return task.any('INSERT INTO users AS u (id, username, email, created_ga, updated_ga, signed_up, avatar_url, followers, following) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
          'ON CONFLICT (id) ' +
          'DO UPDATE SET (updated_ga) = ($4) ' +
          'WHERE u.id = $1',
          [member.id, member.login, null, dbTimestamp, null, false, member.avatar_url, null, null]);
        });
      }
      return task.batch(queries);
    })
    .then(() => {
      requestReposCB(orgname, gotAllRepos);
    })
    .catch(error => {
      console.log('did not successfully add users');
      console.error('ERROR:', error);
    });
  };


  const requestMembers = (orgData, addMembersCB) => {
    orgData.forEach(org => {
      var membersOptions = {
        url: `https://api.github.com/orgs/${org.orgname}/members`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': username,
          'Authorization': `token ${req.body.token}`
        }
      };
      request(membersOptions, (error, response, body) => {
        if (error) {
          console.error('ERROR:', error);
        } else {
          const memberData = JSON.parse(body);
          // console.log('orgname: ', org.orgname);
          // console.log('memberData.length: ', memberData.length);
          addMembersCB(memberData, org.orgname, requestRepos);
        }
      });
    });
  };


  const selectOrg = (requestMembersCB, statusCB) => {
    console.log('in selectOrg');
    db.any('SELECT * FROM orgs AS o INNER JOIN users_orgs AS uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users AS u ON (uo.user_id=u.id) WHERE u.username=($1)', [username])
    .then(data => {
      // set the totalOrgs counter, to be used in addPRCB to send response when all orgs are processed
      totalOrgs = data.length;
      if (totalOrgs === 0) {
        res.send('No orgs found');
      } else {
        requestMembersCB(data, addMembers);
      }
    })
    .catch(error => {
      console.error('ERROR:', error);
      res.status(500).send('Error querying pull request table');
    });
  };

  selectOrg(requestMembers);

};

// /api/v1/users/orgs/:id/pullrequests
exports.retrieveAllPRSForUser = function(req, res) {
  const id = req.params.id;
  console.log('id', id);
  db.any('SELECT * FROM pull_requests WHERE pull_requests.user_id=$1 AND pull_requests.closed_at IS NOT NULL', [id])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading pull_requests table');
    });
};
