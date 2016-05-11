const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;

// GET at '/api/v1/user/:id/stats'
exports.retrieveStats = function(req, res) {
  var queryId = req.params.id;
  
};

// POST at '/api/v1/user/:id/stats'
exports.addStats = function(req, res) {
  var queryId = req.params.id;
};

// PATCH at '/api/v1/user/:id/stats' to update stats 

exports.updateStats = function(req, res) {
  var queryId = req.params.id;
  
  // ** HELPER FUNCTIONS **
  
  //  get the stats for a given user from GitHub
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
              var statId = data[0].id_ga;
              console.log('statId', statId);
              // the query will need to save values in both the user_id column and org_id column
              // but only one will have an actual id in it
              
              // the column we are saving a real id to 
              var validIdCol = owner.type + '_id';
              // the column we are saving a dummy id to
              var nullIdCol;
              
              if (owner.type === 'user') {
                nullIdCol = 'org_id';
              } else {
                nullIdCol = 'user_id';
              }
              
              console.log('validIdCol: ', validIdCol);
              console.log('owner.id: ', owner.id);
              console.log('nullIdCol: ', nullIdCol);
              
              // START HERE - this insert is failing, with this showing in the console:
              
              /*
              statId 639
              validIdCol:  user_id
              owner.id:  15864056
              nullIdCol:  org_id
              Unhandled rejection error: insert or update on table "owners_stats" violates foreign key constraint "stats_owners_stats"
              */
              
              db.any(
                'INSERT INTO $1~ ($2~, $3~, $4~, $5~) ' +
                'VALUES ($6, $7, $8, $9) ' +
                'RETURNING *',
                ['owners_stats', 'created_ga', 'stats_id_ga', validIdCol, nullIdCol,
                dbTimestamp, statId, owner.id, 0]);
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


};
