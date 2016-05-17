const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const request = require('request');
const Promise = require('bluebird');

exports.updateCompetition = (req, res) => {
  var primaryid = req.params.primaryid;
  var secondaryid = req.params.secondaryid;
  var token = req.body.token;

  const updateCommits = (id) => {
    var options = {
      url: CALLBACKHOST + '/api/v1/users/' + id + '/commits',
      method: 'PATCH',
      form: { token: token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('ERROR:', error);
      } else {
        console.log('Success in Worker Updating Commits');
      }
    });
  };

  const updateStats = (id) => {
    console.log('FIRST THEN')
    var options = {
      url: CALLBACKHOST + '/api/v1/users/' + id + '/stats',
      method: 'PATCH',
      form: { token: token },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('ERROR:', error);
      } else {
        console.log('Success in Worker Updating Stats');
        updateCommits(id);
      }
    });
  };

  function updateStatsAsync(userid) {
    console.log('USERID', userid)
    return new Promise((resolve, reject) => {
      updateStats(userid, resolve, reject);
    })
  }

  updateStatsAsync(primaryid).then(updateStatsAsync(secondaryid))

}

