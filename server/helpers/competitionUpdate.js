var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var request = require('request');
var Promise = require('bluebird');
var massiveFetch = require('./massiveFetch');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var primaryUserName = req.body.primaryUsername;
  var secondaryid = req.params.secondaryid;
  var secondaryUserName = req.body.secondaryUsername;
  var token = req.body.token;
  var primaryProfile = {username: primaryUserName};
  var secondaryProfile = {username: secondaryUserName};

  console.log('updateCompetition primaryid', primaryid);
  console.log('updateCompetition primaryUserName', primaryUserName);
  console.log('updateCompetition secondaryid', secondaryid);
  console.log('updateCompetition secondaryUserName', secondaryUserName);
  

  // massiveFetch(primaryid, primaryUserName, token, primaryProfile, false);
  // massiveFetch(secondaryid, secondaryUserName, token, secondaryProfile, false);
};

