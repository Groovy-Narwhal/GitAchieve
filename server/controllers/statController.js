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
  
  // ** HELPER FUNCTIONS **
  
  //  get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(owner, repo, callback) {
    var options = {
      url: 'https://api.github.com/repos/' + owner + '/' + repo + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': owner,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        // 'Authorization': `token ${req.body.token}`
        'Authorization' : 'token dd585d1b6d8c7c8505ef3d453110ac5f2899bbb6'
      }
    };
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        callback(repo, stats);
      }
    });
  };
    
  // callback function - will delete old stats, then add new stats to our database
  var updateStatsInDb = function(repo, stats) {
    // if the repo is an org repo, the stats will be an array that we need to handle
    if (stats.length !== undefined) {
      console.log('stats[0].total', stats[0].total);
      // console.log('stats[0].author.login', stats[0].author.login);
      var dbTimestamp = pgp.as.date(new Date());
      db.tx(function(t) {
        var deleteJoinsQuery = t.any(
          'DELETE from $1~ ' +
          'WHERE $2~ = $3 ' +
          'RETURNING $3',
          ['repos_stats', 'repo_id', repo.id]);
      
        var deleteStatsQuery = t.any(
          'DELETE from $1~ ' +
          'WHERE $2~ = $3~ ',
          ['stats', 'repo_id', repo.id]);      
        
        var insertStatsAndJoinsQuery = stats.map(stat => {
          return t.any(
            'INSERT INTO $1~ ($2~, $3~, $4~, $5~, $6~) ' +
            'VALUES ($7, $8, $9, $10, $11) ' +
            'RETURNING $12~',
            ['stats', 'updated_ga', 'repo_id', 'author_id', 'total', 'weeks',
            dbTimestamp, repo.id, stat.author.id, stat.total, stat.weeks, 'id_ga'])
            .then(statIdGa => {
              t.any(
              'INSERT INTO $1~ ($2~, $3~, $4~) ' +
              'VALUES ($5, $6, $7)'
              ['repos_stats', 'created_ga', 'repo_id', 'stats_id_ga',
              dbTimestamp, repo.id, statIdGa]);
            })
            .catch(error => {
              console.error('Error in inserting stats and joins: ', error);
            });
        });
        return t.batch([deleteJoinsQuery]);
        // return t.batch([deleteJoinsQuery, deleteStatsQuery, insertStatsAndJoinsQuery]);
      })
      .then(data => {
        console.log('Successfully added stats to database: ', data);
        res.send(data);
      })
      .catch(error => {
        console.error('Database error in transaction: ', error);
      });
      
    }
  };
  
  var updateStatsInDbTest = function (repo, stats) {
    if (Array.isArray(stats)) {
      console.log('stats is an array: ', stats);
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
    var owner;
    if (data[0] !== null) {
      owner = data[0].username;
    } else {
      owner = data[1].orgname;
    }
    console.log('owner: ', owner);
    // get the repos from our db for the owner
    db.any(
      'SELECT * FROM $1~ ' +
      'WHERE $1~.$2~=$3',
      ['repos', 'owner', owner])
      .then(repos => {
        // for each repo:
          // make a GET request to GitHub at /repos/:owner/:repo/stats/contributors
          // delete existing stats and joins for the repo from our database
          // add stats and joins for the repo to our database
        repos.forEach((repo, index) => {
          getStatsFromGitHub(owner, repo.name, updateStatsInDbTest);
        });

      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error selecting repos');
      });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error selecting owner');
  });

};
