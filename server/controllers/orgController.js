const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;


// /api/v1/users/:id/orgs
exports.retrieveOrgs = function(req, res) {
  const userId = req.params.id;
  const dbTimestamp = pgp.as.date(new Date());

  const addOrgsToDb = (orgs, callback) => {
    db.tx(task => {
      const queries = orgs.map(org => {
        return task.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~) ' +
          'VALUES ($7, $8, $9, $10) ' +
          'ON CONFLICT ($3~) ' +
          'DO UPDATE SET ($4~, $5~, $6~) = ($8, $9, $10) ' +
          'WHERE $2~.$3~ = $7',
          ['orgs', 'o', 'id', 'orgname', 'followers', 'following',
          id, orgname, followers, following]);
      });
    return task.batch(queries);
    })
    .then(data => {
      console.log('Successfully added orgs!');
      callback();
    })
    .catch(error => {
      console.log('Did not successfully add orgs');
      console.error(error);
    })
  }
}



// '/:orgname'
exports.retrieveOne = function(req, res) {
  var query = {_id: req.params.id};
  // TODO: fill this out with Postgres findOne query
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
