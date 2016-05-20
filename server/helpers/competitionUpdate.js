var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var rp = require('request-promise');
var massiveFetch = require('./massiveFetch');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var primaryRepoId = req.body.primaryrepoid;
  var secondaryid = req.params.secondaryid;
  var secondaryRepoId = req.body.secondaryrepoid;
  var token = req.body.token;
  
  var primaryUserCommitsUpdate = {
    uri: CALLBACKHOST + '/api/v1/users/' + primaryid + '/commits',
    method: 'PUT',
    json: true,
    body: {
      token: token,
      repoid: primaryRepoId
    }
  };
  
  var secondaryUserCommitsUpdate = {
    uri: CALLBACKHOST + '/api/v1/users/' + secondaryid + '/commits',
    method: 'PUT',
    json: true,
    body: {
      token: token,
      repoid: secondaryRepoId
    }
  };
  
  var primaryUserBranchesUpdate = {
    uri: CALLBACKHOST + '/api/v1/users/' + primaryid + '/repos/branches',
    method: 'PATCH',
    json: true,
    body: {
      token: token,
      repoid: secondaryRepoId
    }
  };
  
  var secondaryUserBranchesUpdate = {
    uri: CALLBACKHOST + '/api/v1/users/' + secondaryid + '/repos/branches',
    method: 'PATCH',
    json: true,
    body: {
      token: token,
      repoid: secondaryRepoId
    }
  };
  
  
  var results = {};
  
  rp(primaryUserBranchesUpdate)
    .then(primaryUserBranches => {
      rp(secondaryUserBranchesUpdate)
        .then(secondaryUserBranches => {
          rp(primaryUserCommitsUpdate)
            .then(primaryUserCommits => {
              results.primaryUserCommits = primaryUserCommits;
              rp(secondaryUserCommitsUpdate)
              .then(secondaryUserCommits => {
                results.secondaryUserCommits = secondaryUserCommits;
                res.send(results);
              })
              .catch(error => {
                res.send(error);
              });
            })
            .catch(error => {
              res.send(error);
            });
        })
        .catch(error => {
          res.send(error);
        });
    })
    .catch(error => {
      res.send(error);
    });
};

