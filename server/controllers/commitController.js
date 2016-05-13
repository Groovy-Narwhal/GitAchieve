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
          var ownerName = user.username;
          var repoName = '';

          // for each repo:
            // figure out whether the repo owner is a user or an org
          repos.forEach(repo => {
            repoName = repo.name;            
            db.any('SELECT * FROM $1~ ' +
              'WHERE $2~=$3',
              ['orgs', 'id', repo.owner_id])
              .then(orgs => {
                // if the owner is an org, set the ownerName to the orgname
                if (orgs.length > 0) {
                  ownerName = orgs[0].orgname;
                }
                
                // set up the GET request for this repo
                var options = {
                  uri: 'https://api.github.com/repos/' + ownerName + '/' + repoName + '/commits',
                  headers: {
                    'User-Agent': user.username,
                    // Uncomment this line to make GET requests from within the site (not with Postman)
                    // 'Authorization': `token ${req.body.token}`
                    'Authorization': 'token ' + token
                  },
                  json: true // Automatically parses the JSON string in the response 
                };
                
                // invoke the GET request
                rp(options)
                  .then(commits => {
                    db.tx(t => {
                      var queries = commits.map(commit => {
                        
                        // START HERE - do an upsert for each commit using the SHA as 
                        // a unique id
                        
                        // return t.any('INSERT INTO commits')
                      
                      
                      })
                    })
                    
                    
                    
                  })
                  .catch(error => {
                    console.error('Error in GET request');
                    res.status(500).send;
                  }); 
              })
              .catch(error => {
                console.error('Error selecting repos');
                res.status(500).send;
              });            
          });
          
          res.send('success');
          // db.tx(t => {
          //   var queries = repos.map(repo => {
          //     return 
          //   })
          // })
        })
      .catch(error => {
        console.error('Error selecting repos');
        res.status(500).send;
      });      
    })
    .catch(error => {
      console.error('Error selecting user');
      res.status(500).send;
    });
};
