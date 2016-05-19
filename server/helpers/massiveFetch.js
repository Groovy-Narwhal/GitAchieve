const rp = require('request-promise');
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const cookieParser = require('cookie-parser');
const keys = require('./../config/github.config.js');
const session = require('express-session');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;


const massiveFetch = function (id, username, accessToken, profile, async) {
  
  // update the user's repos in our database   
  const updateRepos = {
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

  const updatePullRequests = {
    uri: CALLBACKHOST + '/api/v1/orgs/' + id + '/pullrequests',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };


  const updateStats = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/stats',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  const updateBranches = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/repos/branches',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  const updateCommits = {
    uri: CALLBACKHOST + '/api/v1/users/' + id + '/commits',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  const updateContribs = {
    uri: CALLBACKHOST + '/gh-fetch/?username=' + username + '&id=' + id,
    method: 'GET',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

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
    rp(updateContribs)
      .then(contribs => {
        console.log('MF 7: Success in updateContribs');
      })
      .catch(error => {
        console.error('MF 6: Error in updateContribs: ', error);
      })

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
                            console.log('MF 6: Success in updateCommits');
                            rp(updateContribs)
                              .then(contribs => {
                                console.log('MF 7: Success in updateContribs');
                                // if all PATCH requests were successful, return true
                                return true;
                              })
                            .catch(error => {
                              console.error('MF 7: Error in updateContribs', error);
                            })
                          })
                          .catch(error => {
                            console.error('MF 6: Error in updateCommits: ', error);
                            return false;
                          });
                      })
                      .catch(error =>{
                        console.error('MF 5: Error in updateBranches: ', error);
                        return false;
                      });
                  })
                  .catch(error =>{
                    console.error('MF 4: Error in updateStats: ', error);
                    return false; 
                  });
              })
              .catch(error =>{
                console.error('MF 3: Error in updatePullRequests: ', error);
                return false;
              });
          })
          .catch(error => {
            console.error('MF 2: Error in updateOrgs: ', error);
            return false;
          });
      })
      .catch(error => {
        console.error('MF 1: Error in updateRepos: ', error);
        return false;
      });
  }
};

module.exports = massiveFetch;

