const PORT = require('../config/config-settings').PORT;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const request = require('request');
const cookieParser = require('cookie-parser');
const keys = require('./../config/github.config.js');
const session = require('express-session');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

const massiveFetch = function (id, username, accessToken, profile) {
  
  // Each of these functions will be chained, one after the other, to update our database
  // from GitHub
  
  const updateRepos = () => {
    // update the user's repos in our database   
    var options = {
      url: CALLBACKHOST + '/api/v1/users/' + id + '/repos',
      method: 'PATCH',
      form: { profile: profile, token: accessToken },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('MF 1: Error in updateRepos: ', error);
      } else {
        console.log('MF 1: Success in updateRepos');
        updateOrgs();
      }
    });    
  }; 
  
  const updateOrgs = () => {
    // update the user's orgs in our database   
    var options = {
      url: CALLBACKHOST + '/api/v1/orgs/' + id + '/orgs',
      method: 'PATCH',
      form: { profile: profile, token: accessToken },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('MF 2: Error in updateOrgs: ', error);
      } else {
        console.log('MF 2: Success in updateOrgs');
        updatePullRequests();
      }
    });
  }; 
  
  
  const updatePullRequests = () => {
    var options = {
      url: CALLBACKHOST + '/api/v1/orgs/' + id + '/pullrequests',
      method: 'PATCH',
      form: { profile: profile, token: accessToken },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('MF 3: Error in updatePullRequests: ', error);
      } else {
        console.log('MF 3: Success in updatePullRequests');
        updateStats();
      }
    });
  };
  
  const updateStats = () => {
    var options = {
      url: CALLBACKHOST + '/api/v1/users/' + id + '/stats',
      method: 'PATCH',
      form: { profile: profile, token: accessToken },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('MF 4: Error in updateStats: ', error);
      } else {
        console.log('MF 4: Success in updateStats');
        updateCommits();
      }
    });
  };
  
  const updateCommits = () => {
    var options = {
      url: CALLBACKHOST + '/api/v1/users/' + id + '/commits',
      method: 'PATCH',
      form: { profile: profile, token: accessToken },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('MF 5: Error in updateCommits: ', error);
      } else {
        console.log('MF 5: Success in updateCommits');
      }
    });
  };

  // Call the first function to start the chain of functions
  updateRepos();
  
};

module.exports = massiveFetch;
