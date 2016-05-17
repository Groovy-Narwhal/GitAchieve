const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// PATCH at '/api/v1/users/orgs/:id/pullrequests'
exports.retrievePullRequests = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
  const username = req.body.profile.username;
  const id = req.params.id;

  // helper functions
  const addPR = (prs) => {
    prs.forEach((pr, index) => {
      db.any('SELECT * FROM users WHERE users.id = ($1)', [pr.user.id])
        .then((data) => {
          db.any('SELECT COUNT(*) FROM users WHERE users.id = ($1)', [pr.user.id])
            .then((data) => {
              if (data[0].count !== '0') {
                db.any('INSERT INTO pull_requests AS pr (id, created_at, updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) ' +
                  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                  'ON CONFLICT (id) ' +
                  'DO UPDATE SET (updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) = ($3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                  'WHERE pr.id = ($1)',
                  [pr.id, dbTimestamp, dbTimestamp, pr.user.id, pr.state, pr.diff_url, pr.merged_at, pr.milestone, pr.base.ref, pr.base.repo.watchers_count, pr.base.repo.stargazers_count]);
              }
            });
        })
        .catch(error => {
          console.error('ERROR:', error);
        });
    });
  };


  const gotAllRepos = (data, owner, addPRCB) => {
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
          const data = JSON.parse(body);
          return addPRCB(data);
        }
      });
    });
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
        const data = JSON.parse(body);
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
      console.log('successfully added members');
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
          addMembersCB(memberData, org.orgname, requestRepos);
        }
      });
    });
  };


  const selectOrg = (requestMembersCB, statusCB) => {
    db.any('SELECT * FROM orgs AS o INNER JOIN users_orgs AS uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users AS u ON (uo.user_id=u.id) WHERE u.username=($1)', [username])
    .then(data => {
      requestMembersCB(data, addMembers);
    })
    .then(statusCB)
    .catch(error => {
      console.error('ERROR:', error);
      res.status(500).send('Error querying pull request table');
    });
  };

  return selectOrg(requestMembers, (data)=> {res.send(data)} );

};

// /api/v1/users/orgs/:id/pullrequsts
exports.retrieveAllPRSForUser = function(req, res) {
  const id = req.params.id;
  console.log('id', id)
  db.any('SELECT * FROM pull_requests WHERE pull_requests.user_id=$1 AND pull_requests.closed_at IS NOT NULL', [id])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading pull_requests table');
    });
};
