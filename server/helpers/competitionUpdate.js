var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var rp = require('request-promise');
var massiveFetch = require('./massiveFetch');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var primaryRepoId = req.body.primaryrepoid;
  var secondaryid = req.params.secondaryid;
  var secondaryRepoId = req.body.secondaryrepoid;
  var token = req.body.token;
  
  var primaryUserOptions = {
    uri: CALLBACKHOST + '/api/v1/users/' + primaryid + '/commits',
    method: 'PUT',
    json: true,
    body: {
      token: token,
      repoid: primaryRepoId
    }
  };
  
  var secondaryUserOptions = {
    uri: CALLBACKHOST + '/api/v1/users/' + secondaryid + '/commits',
    method: 'PUT',
    json: true,
    body: {
      token: token,
      repoid: secondaryRepoId
    }
  };
  
  var results = {};
  
  rp(primaryUserOptions)
    .then(primaryUserCommits => {
      results.primaryUserCommits = primaryUserCommits;
      rp(secondaryUserOptions)
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
};

