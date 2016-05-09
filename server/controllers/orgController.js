const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

// /api/v1/users/orgs/:id/orgs
exports.retrieveOrgs = (req, res) => {
  const queryId = req.params.id;
  const username = req.body.profile.username;
  const token = req.body.token;
  const dbTimestamp = pgp.as.date(new Date());

  // helper functions
  const addOrgsToDb = (orgs, callback) => {
    db.tx(task => {
      const queries = orgs.map(org => {
        return task.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~) ' +
          'VALUES ($7, $8, $9, $10) ' +
          'ON CONFLICT ($3~) ' +
          'DO UPDATE SET ($4~, $5~, $6~) = ($8, $9, $10) ' +
          'WHERE $2~.$3~ = $7',
          ['orgs', 'o', 'id', 'orgname', 'avatar_url', 'updated_ga',
          org.id, org.login, org.avatar_url, dbTimestamp]);
      });
    return task.batch(queries);
    })
    .then(data => {
      console.log('Successfully added orgs!');
      callback(data);
    })
    .catch(error => {
      console.log('Did not successfully add orgs');
      console.error(error);
    })
  }

  // add a join for each org to our user_orgs table, associating each org with a user
  var addJoinsToDb = (orgs, callback) => {
    db.tx(task => {
      var queries = orgs.map(org => {
        return task.any('INSERT INTO $1~ ($2~, $3~, $4~) ' +
        'SELECT $5, $6, $7 WHERE NOT EXISTS ' +
        '(SELECT * FROM $1~ WHERE $3~ = $6 AND $4~ = $7)',
        ['users_orgs', 'created_ga', 'user_id', 'org_id',
        dbTimestamp, queryId, org.id]);
      });
      return task.batch(queries);
    })
    .then(data => {
      console.log('Successfully added users_orgs joins');
      callback(data);
    })
    .catch(error => {
      console.log('Add users_orgs join error');
      console.error(error);
    });
  }

  // send the response for the api endpoint, containing all this user's orgs
  var patchOrgsResponse = () => {
    db.any(('SELECT o.id, o.updated_ga, o.orgname, o.avatar_url, o.followers, o.following, o.score ' +
      'FROM users_orgs uo ' +
      'INNER JOIN orgs o ' +
      'ON o.id = uo.org_id ' +
      'WHERE uo.user_id=$1'), [queryId])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error querying orgs table');
    })
  }

  // get user info from GitHub
  var getOrgsFromGitHub = (username, callback) => {
    var options = {
      url: 'https://api.github.com/user/orgs',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('error: ', error);
      } else {
        callback(body);
      }
    });
  };

  // gather the helper functions together into one asynchronous series
  const handleGitHubData = data => {
    var orgs = JSON.parse(data);
    addOrgsToDb(orgs, addJoinsToDb.bind(null, orgs, patchOrgsResponse))
  }

  // call helper functions
  getOrgsFromGitHub(username, handleGitHubData);
};

// '/github/:username/orgs'
exports.retrieveAllOrgsForUser = function(req, res) {
  db.any('SELECT o.orgname, o.avatar_url FROM orgs o INNER JOIN users_orgs uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users u on (uo.user_id=u.id) WHERE u.username=$1', [req.params.username])
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading orgs table');
    });
};

// '/:orgname/stats'
exports.retrieveStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addStats = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

// '/:orgname/achievements'
exports.retrieveAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};

exports.addAchievements = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
};
