const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// /api/v1/users/orgs/:id/pullrequsts
exports.retrievePullRequests = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
  const username = req.body.profile.username;

  // helper functions
  const addPR = (prs) => {
    if (prs.length) {
      db.tx(task => {
        const queries = prs.map(pr => {
          console.log('PR', pr)
          return task.any('INSERT INTO pull_requests AS pr (id, created_at, updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
            'ON CONFLICT (id) ' +
            'DO UPDATE SET (updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) = ($3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
            'WHERE pr.id = $1',
            [pr.id, dbTimestamp, dbTimestamp, pr.user.id, pr.state, pr.diff_url, pr.merged_at, pr.milestone, pr.base.ref, pr.base.repo.watchers_count, pr.base.repo.stargazers_count]
          )
        });
      })
      .then(data => {
      })
      .catch(error => {
        console.log('Did not successfully add pull requests');
        console.error(error);
      })
    }
  };

  // get user info from GitHub
  var getPRSFromGitHub = (owner, repo, callback) => {
    var options = {
      url: `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('error: ', error);
      } else {
        callback(body);
      }
    });
  };

  // gather the helper functions together into one asynchronous series
  const handleGitHubData = data => {
    var prs = JSON.parse(data);
    addPR(prs);
  }

  db.any('SELECT o.orgname FROM orgs o INNER JOIN users_orgs uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users u on (uo.user_id=u.id) WHERE u.username=$1', [username])
    .then(data => {
      data.forEach(org => {
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
              console.error('error: ', error);
            } else {
              const parsedBody = JSON.parse(body);

              parsedBody.forEach(member => {
                // add the member to our database, or update them if they already exist
                db.any('INSERT INTO users AS u (id, username, email, created_ga, updated_ga, signed_up, avatar_url, followers, following) ' +
                  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
                  'ON CONFLICT (id) ' +
                  'DO UPDATE SET (updated_ga) = ($4) ' +
                  'WHERE u.id = $1',
                  [member.id, member.login, null, dbTimestamp, null, false, member.avatar_url, null, null])
                  .then((data) => {
                    var repoOptions = {
                      url: `https://api.github.com/orgs/${org.orgname}/repos`,
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': username,
                        'Authorization': `token ${req.body.token}`
                      }
                    };
                    request(repoOptions, (error, response, body) => {
                      if (error) {
                        console.error('error: ', error);
                      } else {
                        const parsedBody = JSON.parse(body);
                        parsedBody.forEach(repo => {
                          // call helper functions
                          getPRSFromGitHub(org.orgname, repo.name, handleGitHubData);
                        })
                      }
                    });
                  })
                  .catch((error) => {
                    console.log('error in member upsert');
                    console.error(error);
                  });
              })
            }
          })
        })
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading orgs table');
    });
};


// '/github/:username/pullrequests'
exports.retrieveAllPRSForUser = function(req, res) {
  db.any('SELECT * FROM pull_requests WHERE pull_requests.username=$1 AND pull_requests.closed_at != null', [req.params.username])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading pull_requests table');
    });
};