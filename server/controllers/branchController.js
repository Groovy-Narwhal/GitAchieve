var rp = require('request-promise');
var db = require('../db/database.js').db;
var pgp = require('../db/database.js').pgp;
var getRepoOwners = require('../helpers/getRepoOwners');
var token = require('../config/github.config').token;


// GET at /api/v1/users/:id/repos/branches to get a repo's branches by user id and repo id
// headers must include 'repoid'
exports.retrieveBranches = (req, res) => {
  var queryId = req.params.id;
  var repoId = req.headers.repoid;
  var dbTimestamp = pgp.as.date(new Date());
  
  db.any(('SELECT r.id, r.updated_ga, r.created_at, r.name, r.owner_id, r.watchers_count, ' +
    'r.stargazers_count, r.forks_count, r.org_commit_activity ' + 
    'FROM users_repos ur ' +
    'INNER JOIN repos r ' + 
    'ON r.id = ur.repo_id ' + 
    'WHERE ur.user_id=$1 ' +
    'AND r.id =$2'), 
    [queryId, repoId])
    .then((repos) => {
      db.tx(t => {
        var queries = [];
        if (repos.length > 0) {
          queries = repos.map(repo => {
            return t.any(
            'SELECT b.sha, b.updated_ga, b.name ' + 
            'FROM repos_branches rb ' +
            'INNER JOIN branches b ' +
            'ON b.sha = rb.branch_sha ' +
            'WHERE rb.repo_id =($1)', 
            repo.id);
          });
        }
        return t.batch(queries);
      })
      .then(branches => {
        res.send(branches);
      })
      .catch(error => {
        console.error('Error in querying branches: ', error);
        res.status(500).send('Error in querying branches');
      });
    })
    .catch(error => {
      console.error('Error in querying repos: ', error);
      res.status(500).send('Error in querying repos');
    });
  
};

// PATCH at /api/v1/users/:id/repos/branches to update all of the branches for all of a user's repos
exports.updateBranches = (req, res) => {
  var queryId = req.params.id;
  var dbTimestamp = pgp.as.date(new Date());

  var getAndSaveBranchesFromGitHub = repoOwners => {
    var totalRepos = repoOwners.length;
    var repoCountGetBranches = 0;
    var updatedBranches = [];
    
    repoOwners.forEach(repoOwner => {
      var ownerName;
      if (repoOwner.repoOwnerId === repoOwner.userId) {
        ownerName = repoOwner.userName;
      } else {
        ownerName = repoOwner.orgName;
      }
      // configuration of GitHub GET request
      var options = {
        uri: 'https://api.github.com/repos/' + ownerName + '/' + repoOwner.repoName + '/branches',
        headers: {
          'User-Agent': repoOwner.userName,
          // Uncomment this line to make GET requests from within the site (not with Postman)
          'Authorization': `token ${req.body.token}`
          // Uncomment this line to make GET requests from Postman
          // 'Authorization': 'token ' + token
        },
        json: true // Automatically parses the JSON string in the response 
      };
      // invoke the GET request from GitHub
      rp(options)
        .then(branches => {
          db.tx(t => {
            var queries = [];
            if (branches.length > 0) {
            // add queries to add each branch to database in branches table
              queries = branches.map(branch => {
                return t.any('INSERT INTO $1~ as $2~ ($3~, $4~, $5~) ' +
                  'VALUES ($6, $7, $8) ' +
                  'ON CONFLICT ($4~) ' +
                  'DO UPDATE SET ($3~, $5~) = ($6, $8) ' + 
                  'WHERE $2~.$4~ = $7 ' +
                  'RETURNING *',
                  ['branches', 'b', 'updated_ga', 'sha', 'name',
                  dbTimestamp, branch.commit.sha, branch.name]);
              });
              // add queries to add joins to database in repos_branches table
              queries = queries.concat(branches.map(branch => {
                return t.any('INSERT INTO $1~ ($2~, $3~, $4~) ' +
                  'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
                  '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
                  ['repos_branches', 'created_ga', 'repo_id', 'branch_sha',
                  dbTimestamp, repoOwner.repoId, branch.commit.sha]);
              }));
            }
            return t.batch(queries);
          })
          .then(branchesDb => {
            // return all branches that were created for this user's repos
            db.any(
            'SELECT b.sha, b.updated_ga, b.name ' + 
            'FROM repos_branches rb ' +
            'INNER JOIN branches b ' +
            'ON b.sha = rb.branch_sha ' +
            'WHERE rb.repo_id =($1)', 
            repoOwner.repoId)
              .then(branches => {
                updatedBranches.push(branches);
                // since this happens for each of the user's repos,
                // wait until all repos have been added to send the server response
                repoCountGetBranches++;
                if (repoCountGetBranches === totalRepos) {
                  res.send(updatedBranches);
                }
              })
              .catch(error => {
                console.error('Error in querying branches: ', error);
              });
          })
          .catch(error => {
            console.error('Error in insert branches: ', error);
          });
        })
        .catch(error => {
          // if the GitHub request results in a non-500 status code, it may mean a repo has been
          // deleted - keep processing the rest, and increment count
          if (error.statusCode !== 500) {
            repoCountGetBranches++;
            console.log('Error in getBranchesFromGitHub - repo: "' + repoOwner.repoName 
            + '"" for user: "' + repoOwner.userName + '"" not found in GitHub');
            // if all repos have been added, send the server response
            if (repoCountGetBranches === totalRepos) {
              res.status(500).send();
            }
          } else {
            console.error('Error in GET from GitHub: ', error);
            res.status(500).send('Error in GET from GitHub');
          }
        });
    });
  };    
  
  getRepoOwners(queryId, getAndSaveBranchesFromGitHub);
  
};
