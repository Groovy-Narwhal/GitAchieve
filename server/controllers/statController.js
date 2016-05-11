const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;

// GET at '/api/v1/owner/:id/stats'
exports.retrieveStats = function(req, res) {
  var queryId = req.params.id;
  
};

// POST at '/api/v1/owner/:id/stats'
exports.addStats = function(req, res) {
  var queryId = req.params.id;
};

// PATCH at '/api/v1/owner/:id/stats' to update stats 
exports.updateStats = function(req, res) {
  var queryId = req.params.id;
  
  // ** HELPER FUNCTIONS **
  
  //  get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(owner, repo, callback) {
    var options = {
      url: 'https://api.github.com/repos/' + owner.name + '/' + repo.name + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': owner.name,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        // 'Authorization': `token ${req.body.token}`
        'Authorization': 'token ' + token
      }
    };
    
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        console.log('success in getStats');
        callback(owner, repo, stats);
      }
    });
  };
    
  // callback function - will delete old stats, then add new stats to our database
  var updateStatsInDb = function(owner, repo, stats) {
    var statsArray = JSON.parse(stats);
    
    if (statsArray.length !== undefined) {
      var dbTimestamp = pgp.as.date(new Date());
      db.tx(function(t) {
        
        var deleteJoinsQuery = t.any(
          'DELETE from $1~' +
          'WHERE $2~=$3',
          ['owners_stats', 'owner_id', owner.id]);
      
        var deleteStatsQuery = t.any(
          'DELETE from $1~' +
          'WHERE $2~=$3',
          ['stats', 'repo_id', repo.id]);      
        
        var insertStatsAndJoinsQuery = statsArray.map(function(stat) {
          
          return (t.any(
            'INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~) ' +
            'VALUES ($7, $8, $9, $10, $11) ' +
            'RETURNING $12~',
            ['stats', 'updated_ga', 'repo_id', 'author_id', 'total', 'weeks',
            dbTimestamp, repo.id, stat.author.id, stat.total, JSON.stringify(stat.weeks), 'id_ga'])
            .then(data => {
              // console.log('data: ' + data + ', type: ' + typeof(data));
              // console.log('data', JSON.stringify(data));
              // console.log('type of data[0].id_ga', typeof data[0].id_ga);
              var statId = data[0].id_ga;
              console.log('statId', statId);
              console.log('owner.id', owner.id);
              db.any(
                'INSERT INTO $1~ ($2~, $3~, $4~) ' +
                'VALUES ($5, $6, $7) ' +
                'RETURNING *',
                ['owners_stats', 'created_ga', 'stats_id_ga', 'owner_id',
                dbTimestamp, statId, owner.id]);
            })
          );
        });
        
        // return t.batch(insertStatsAndJoinsQuery);
        var queryArray = [deleteJoinsQuery, deleteStatsQuery].concat(insertStatsAndJoinsQuery);
      })
      .then(data => {
        console.log('success in updateStatsInDb');
      })
      .catch(error => {
        console.error('Error updating stats in db: ', error);
      });
    }
  };
    
  // CALL HELPER FUNCTIONS
    
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
    var owner = {};
    if (data[0] !== null) {
      owner.name = data[0].username;
      owner.id = data[0].id;
    } else {
      owner.name = data[1].orgname;
      owner.id = data[1].id;
    }
    // get the repos from our db for the owner
    db.any(
      'SELECT * FROM $1~ ' +
      'WHERE $1~.$2~=$3',
      ['repos', 'owner', owner.name])
      .then(repos => {
        // for each repo:
          // make a GET request to GitHub at /repos/:owner/:repo/stats/contributors
          // delete existing stats and joins for the repo from our database
          // add stats and joins for the repo to our database
        repos.forEach((repo, index) => {
          getStatsFromGitHub(owner, repo, updateStatsInDb);
        });
      })
      .then(data => {
        res.send('success');
      })
      .catch(error => {
        console.error('Error selecting repos: ', error);
        // res.status(500).send('Error selecting repos');
      });
  })
  .catch(error => {
    console.error('Error selecting owner: ', error);
    // res.status(500).send('Error selecting owner');
  });

};
