var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var rp = require('request-promise');
var massiveFetch = require('./massiveFetch');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var primaryUsername = req.body.primaryUsername;
  var secondaryid = req.params.secondaryid;
  var secondaryUsername = req.body.secondaryUsername;
  var token = req.body.token;
  var primaryProfile = {username: primaryUsername};
  var secondaryProfile = {username: secondaryUsername};

  console.log('updateCompetition primaryid', primaryid);
  console.log('updateCompetition primaryUsername', primaryUsername);
  console.log('updateCompetition secondaryid', secondaryid);
  console.log('updateCompetition secondaryUsername', secondaryUsername);
  
  console.log('Competition Update, primaryUsername: ' + primaryUsername + ', secondaryUsername: ' + secondaryUsername);
  
  var primaryUserOptions = {
    uri: CALLBACKHOST + '/api/v1/users/' + primaryid + '/commits',
    method: 'PATCH',
    json: true,
    body: {
      token: token
    }
  };
  
  var secondaryUserOptions = {
    uri: CALLBACKHOST + '/api/v1/users/' + secondaryid + '/commits',
    method: 'PATCH',
    json: true,
    body: {
      token: token
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

