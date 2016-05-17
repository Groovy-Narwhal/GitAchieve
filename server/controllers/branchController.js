const rp = require('request-promise');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const getRepoOwners = require('../helpers/getRepoOwners');

// GET at /api/v1/users/:id/repos/branches
exports.retrieveBranches = (req, res) => {
  const queryId = req.params.id;
  const dbTimestamp = pgp.as.date(new Date());
  
};

// PATCH at /api/v1/users/:id/repos/branches
exports.updateBranches = (req, res) => {
  const queryId = req.params.id;
  const dbTimestamp = pgp.as.date(new Date());

  const getBranchesFromGitHub = repoOwners => {
    var totalRepos = repoOwners.length;
    var repoCountGetBranches = 0;
    
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
      // invoke the GET request
      rp(options)
        .then(branches => {
          
        })
        .catch(error => {
          if (error.statusCode !== 500) {
            repoCountGetCommits++;
            console.log('Error in getBranchesFromGitHub - repo: "' + repoOwner.repoName + '"" for user: "' + repoOwner.userName + '"" not found in GitHub');
            if (repoCountGetCommits === totalRepos) {
              res.status(500).send();
            }
          } else {
            console.error('Error in GET from GitHub: ', error);
            res.status(500).send;
          }
      });    
  };
  
  getRepoOwners(queryId, getBranchesFromGitHub);
  
};

