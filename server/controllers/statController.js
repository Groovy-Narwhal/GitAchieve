const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

// GET at '/api/v1/users/:id/stats'
exports.retrieveStats = function(req, res) {
  var queryId = req.params.id;
  
};

// POST at '/api/v1/users/:id/stats'
exports.addStats = function(req, res) {
  var queryId = req.params.id;
};

// PATCH at '/api/v1/user/:id/stats' to update stats 
exports.updateStats = function(req, res) {
  var queryId = req.params.id;
  // get the owner name (either username or orgname) from the database by id
  db.tx(function(t) {
    var userQuery = t.oneOrNone(
    'SELECT * FROM $1~ ' +
    'WHERE $2~=$3',
    ['users', 'id', queryId]);
    var orgQuery = t.oneOrNone(
      'SELECT * FROM $1~ ' +
      'WHERE $2~=$3',
      ['orgs', 'id', queryId]);
    return t.batch([userQuery, orgQuery]);
  })
  .then(data => {
    var owner;
    if (data[0] !== null) {
      owner = data[0].id;
    } else {
      owner = data[1].id;
    }
    console.log('owner in updateStats', owner);
    res.send(data);

    // START HERE - we have the owner's id number, whether the owner is a user or an org

    // get the repos from our db for the owner
    // for each repo, make a GET request to GitHub at /repos/:owner/:repo/stats/contributors
    // save stats to our db
    // save a join to our db for repos_stats
            
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error selecting owner');
  })

};
