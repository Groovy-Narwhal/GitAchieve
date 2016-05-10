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
  const id = req.params.id;

  // helper functions
  const addPR = (prs) => {
    prs.forEach((pr, index) => {
      return db.any('SELECT * FROM users WHERE users.id = ($1)', [pr.user.id])
        .then((data) => {
          return db.any('SELECT COUNT(*) FROM users WHERE users.id = ($1)', [pr.user.id])
            .then((data) => {
              if (data[0].count !== '0') {
                db.any('INSERT INTO pull_requests AS pr (id, created_at, updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) ' +
                  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                  'ON CONFLICT (id) ' +
                  'DO UPDATE SET (updated_ga, user_id, state, diff_url, closed_at, milestone, base_ref, base_repo_watchers_count, base_repo_stargazers_count) = ($3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                  'WHERE pr.id = ($1)',
                  [pr.id, dbTimestamp, dbTimestamp, pr.user.id, pr.state, pr.diff_url, pr.merged_at, pr.milestone, pr.base.ref, pr.base.repo.watchers_count, pr.base.repo.stargazers_count])
              }
            })
            .catch(error => {
              console.error('ERROR: ', error);
            })
        })
        .catch(error => {
          console.error('ERROR: ', error);
        })
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
          console.error(error);
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
        console.error('error: ', error);
      } else {
        const data = JSON.parse(body);
        return gotAllReposCB(data, orgname, addPR);
      }
    });
  };


  const addMembers = (memberData, orgname, requestReposCB) => {
    db.tx(task => {
      var queries = memberData.map(member => {
        return task.any('INSERT INTO users AS u (id, username, email, created_ga, updated_ga, signed_up, avatar_url, followers, following) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
        'ON CONFLICT (id) ' +
        'DO UPDATE SET (updated_ga) = ($4) ' +
        'WHERE u.id = $1',
        [member.id, member.login, null, dbTimestamp, null, false, member.avatar_url, null, null])
      });
      return task.batch(queries);
    })
    .then(() => {
      console.log('successfully added members');
      return requestReposCB(orgname, gotAllRepos);
    })
    .catch(error => {
      console.log('did not successfully add users');
      console.error('error', error)
    });
  };


  const requestMembers = (orgData, addMembersCB) => {
    orgData.forEach(org => {
      // if (org.orgname === 'Groovy-Narwhal') {
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
            const memberData = JSON.parse(body);
            return addMembersCB(memberData, org.orgname, requestRepos);
          }
        })
      // }
    })
  };


  const selectOrg = (requestMembersCB) => {
    db.any('SELECT * FROM orgs AS o INNER JOIN users_orgs AS uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users AS u ON (uo.user_id=u.id) WHERE u.username=($1)', [username])
    .then(data => {
      return requestMembersCB(data, addMembers);
    }).catch(error => {
      console.error('ERROR: ', error);
    })
  };

  selectOrg(requestMembers);

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