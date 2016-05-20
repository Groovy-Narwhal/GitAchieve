var rp = require('request-promise');
var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var cookieParser = require('cookie-parser');
var keys = require('./../config/github.config.js');
var session = require('express-session');
var db = require('../db/database.js').db;
var pgp = require('../db/database.js').pgp;


var massiveFetch = function (id, username, accessToken, profile, async, callback) {
  console.log('In massiveFetch, username: ' + username + ', id: ' + id);
  
  // update the user's repos in our database   
  var updateRepos = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/repos',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };

  // update the user's orgs in our database   
  var updateOrgs = {
    uri: CALLBACKHOST + '/api/v1/orgs/' + id + '/orgs',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };

  var updatePullRequests = {
    uri: CALLBACKHOST + '/api/v1/orgs/' + id + '/pullrequests',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };


  var updateStats = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/stats',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };

  var updateBranches = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/repos/branches',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };

  var updateCommits = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/commits',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };

  // if async is false or undefined, run each PATCH request independently
  if (!async) {
    rp(updateRepos)
      .then(repos => {
        console.log('MF 1: Success in updateRepos');
      })
      .catch(error => {
        console.error('MF 1: Error in updateRepos: ', error);
      });
    rp(updateOrgs)
      .then(orgs => {
        console.log('MF 2: Success in updateOrgs');
      })
      .catch(error =>{
        console.error('MF 2: Error in updateOrgs: ', error);
      });
    rp(updatePullRequests)
      .then(pullRequests => {
        console.log('MF 3: Success in updatePullRequests');
      })
      .catch(error => {
        console.error('MF 3: Error in updatePullRequests: ', error);
      });
    rp(updateStats)
      .then(stats => {
        console.log('MF 4: Success in updateStats');
      })
      .catch(error => {
        console.error('MF 4: Error in updateStats: ', error);
      });
    rp(updateBranches)
      .then(branches => {
        console.log('MF 5: Success in in updateBranches');
      })
      .catch(error => {
        console.error('MF 5: Error in in updateBranches: ', error);
      });  
    rp(updateCommits)
      .then(commits => {
        console.log('MF 6: Success in updateCommits');
      })
      .catch(error => {
        console.error('MF 6: Error in updateCommits: ', error);
      });

  } else {
  // if async is true, run each PATCH request one after the other\
  // if any of them fail, the rest will not run
    rp(updateRepos)
      .then(repos => {
        console.log('MF 1: Success in updateRepos');
        rp(updateOrgs)
          .then(orgs => {
            console.log('MF 2: Success in updateOrgs');
            rp(updatePullRequests)
              .then(pullRequests => {
                console.log('MF 3: Success in updatePullRequests');
                rp(updateStats)
                  .then(stats => {
                    console.log('MF 4: Success in updateStats');
                    rp(updateBranches)
                      .then(commits => {
                        console.log('MF 5: Success in updateBranches');
                        rp(updateCommits)
                          .then(branches => {
                            console.log('MF 6: Success in in updateCommits');
                            // if all PATCH requests were successful, return true
                            callback(true);
                          })
                          .catch(error => {
                            console.error('MF 6: Error in in updateCommits: ', error);
                            callback(false);
                          });
                      })
                      .catch(error =>{
                        console.error('MF 5: Error in updateBranches: ', error);
                        callback(false);
                      });
                  })
                  .catch(error =>{
                    console.error('MF 4: Error in updateStats: ', error);
                    callback(false); 
                  });
              })
              .catch(error =>{
                console.error('MF 3: Error in updatePullRequests: ', error);
                callback(false);
              });
          })
          .catch(error => {
            console.error('MF 2: Error in updateOrgs: ', error);
            callback(false);
          });
      })
      .catch(error => {
        console.error('MF 1: Error in updateRepos: ', error);
        callback(false);
      });
  }
};

module.exports = massiveFetch;

