const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const request = require('request');
const Promise = require('bluebird');
const massiveFetch = require('./massiveFetch');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var primaryUserName = req.body.primaryUsername;
  var secondaryid = req.params.secondaryid;
  var secondaryUserName = req.body.secondaryUsername;
  var token = req.body.token;

  massiveFetch(primaryid, primaryUserName, token, null, false);
  massiveFetch(secondaryid, secondaryUserName, token, null, false);
};

