const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;
const rp = require('request-promise');

// GET at '/api/v1/users/:id/commits'
exports.retrieveCommits = function(req, res) {

};


// PATCH at '/api/v1/users/:id/commits'
exports.updateCommits = function(req, res) {
  var queryId = req.params.id;
  var dbTimestamp = pgp.as.date(new Date());
  
  // ** HELPER FUNCTIONS **
  
  // to be used once each commit's author has been added to the users table
  var saveCommitsAndJoins = (commits, repo, repoCount, totalRepos) => {
    var totalCommits = commits.length;
    var commitCount = 0;
    // save commits to database, using SHA as unique id
    db.tx(t => {
      queries = commits.map(commit => {
        return t.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~) ' +
          'VALUES ($8, $9, $10, $11, $12) ' +
          'ON CONFLICT ($3~) ' + 
          'DO UPDATE SET ($4~, $5~, $6~, $7~) = ($9, $10, $11, $12) ' +
          'WHERE $2~.$3~ = $8',
          ['commits', 'c', 'sha', 'updated_ga', 'date', 'user_id', 'commit_message',
          commit.sha, dbTimestamp, pgp.as.date(new Date(commit.commit.author.date)), commit.author.id, commit.commit.message]);
      });
      return t.batch(queries);
    })
    .then(data => {
      // save joins to database, associating each commit with a repo
      db.tx(t => {
        queries = commits.map(commit => {
          // only add a join row if it doesn't exist already
          return t.any('INSERT INTO $1~ ($2~, $3~, $4~) ' +
            'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
            '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
            ['commits_repos', 'created_ga', 'repo_id', 'commit_sha',
            dbTimestamp, repo.id, commit.sha]);
        });
        return t.batch(queries);
      }) 
      .then(data => {
        commitCount++;
        console.log('-----');
        console.log('repoCount = ' + repoCount);
        console.log('totalRepos = ' + totalRepos);
        if (repoCount === totalRepos) {
          res.send('success'); 
        }
      })
      .catch(error => {
        console.error('Error adding joins: ', error);
        res.status(500).send;
      }); 
    })
    .catch(error => {
      console.error('Error adding commits: ', error);
      res.status(500).send;
    }); 
  };            
  
  // gets all commits for the user's repos
  var getCommitsAndSaveUsers = callback => {
    // get the user for this queryId
    db.one('SELECT * from $1~ ' +
      'WHERE $2~=$3',
      ['users', 'id', queryId])
      // get the repos for this user
      .then(user => {
        db.any('SELECT r.id, r.owner_id, r.name ' +
          'FROM users_repos ur ' +
          'INNER JOIN repos r ' +
          'ON r.id = ur.repo_id ' +
          'WHERE ur.user_id=$1',
          [queryId])
          // set up a GET request for each of this user's repos
          .then(repos => {
            console.log('in commitController, repos: ', repos);
            
            var repoCount = 0;
            var totalRepos = repos.length;
            var ownerName = user.username;
            var repoName = '';
            
            var repoOwners = [];

            repos.forEach(repo => {
              db.oneOrNone('SELECT * FROM $1~ ' +
                'WHERE $2~=$3',
                ['orgs', 'id', repo.owner_id])
                .then(org => {
                  if (org !== null) {
                    repoOwners.push({
                      repoId: repo.id,
                      username: user.username,
                      userId: user.id,
                      orgId: org.id,
                      repoOwnerId: repo.owner_id
                    });
                  } else {
                    repoOwners.push({
                      repoId: repo.id,
                      username: user.username,
                      userId: user.id,
                      orgId: null,
                      repoOwnerId: repo.owner_id
                    });
                  }
                })
                .then(data => {
                  console.log('repoOwners: ', repoOwners);
                })  
                .catch(error => {
                  console.error('Error selecting orgs: ', error);
                  res.status(500).send;
                });
            });
          })  
          .catch(error => {
            console.error('Error selecting orgs: ', error);
            res.status(500).send;
          });   

            // for each repo:
              // figure out whether the repo owner is a user or an org
            // repos.forEach(repo => {
            //   repoName = repo.name;            
            //   db.oneOrNone('SELECT * FROM $1~ ' +
            //     'WHERE $2~=$3',
            //     ['orgs', 'id', repo.owner_id])
            //     .then(orgs => {
            //       // if the owner is an org, set the ownerName to the orgname
            //       console.log('repoName: ', repoName);
            //       console.log('orgs', orgs);
            //     })
            //     .then(data => {
            //       // set up the GET request for this repo
            //       var options = {
            //         uri: 'https://api.github.com/repos/' + ownerName + '/' + repoName + '/commits',
            //         headers: {
            //           'User-Agent': user.username,
            //           // Uncomment this line to make GET requests from within the site (not with Postman)
            //           // 'Authorization': `token ${req.body.token}`
            //           'Authorization': 'token ' + token
            //         },
            //         json: true // Automatically parses the JSON string in the response 
            //       };
                  
            //       // invoke the GET request
            //       rp(options)
            //         .then(commits => {
            //           db.tx(t => {
            //             // insert each commit's author as a user if they don't exist in users table
            //             var queries = commits.map(commit => {
            //               return t.any ('INSERT INTO $1~ as $2~ ($3~, $4~, $5~, $6~, $7~, $8~) ' +
            //                 'VALUES ($9, $10, $11, $12, $13, $14) ' +
            //                 'ON CONFLICT ($3~) ' +
            //                 'DO NOTHING',
            //                 ['users', 'u', 'id', 'created_ga', 'username', 'signed_up', 'email', 'avatar_url',
            //                 commit.author.id, dbTimestamp, commit.author.login, false, commit.commit.author.email, commit.author.avatar_url]);
            //             });
            //             return t.batch(queries);
            //           })  
            //           .then(data => {
            //             repoCount++;
            //             console.log('invoking callback with ' + commits.length + ' commits');
            //             callback(commits, repo, repoCount, totalRepos);
            //           })
            //           .catch(error => {
            //             console.error('Error adding users: ', error);
            //             res.status(500).send;
            //           }); 
            //         })
            //         .catch(error => {
            //           console.error('Error in GET request: ', error);
            //           res.status(500).send;
            //         }); 
            //     })
            //     .catch(error => {
            //       console.error('Error selecting repos: ', error);
            //       res.status(500).send;
            //     });            
            // });
          // })
          // .catch(error => {
          //   console.error('Error selecting orgs: ', error);
          //   res.status(500).send;
          // });      
      })
      .catch(error => {
        console.error('Error selecting user: ', error);
        res.status(500).send;
      });
  };
  
  // CALL HELPER FUNCTIONS
  
  getCommitsAndSaveUsers(saveCommitsAndJoins);
  
};


