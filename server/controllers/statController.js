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
      url: 'https://api.github.com/repos/' + owner + '/' + repo.name + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': owner,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        // 'Authorization': `token ${req.body.token}`
        'Authorization' : 'token ' + token
      }
    };
    
    request(options, (error, response, stats) => {
      if (error) {
        console.error(error);
      } else {
        console.log('success in getStats');
        callback(repo, stats);
      }
    });
  };
    
  // callback function - will delete old stats, then add new stats to our database
  var updateStatsInDb = function(repo, stats) {
    var statsArray = JSON.parse(stats);
    console.log('in updateStatsInDb, repo.id:', repo.id);
    // console.log('in updateStatsInDb, statsArray: ', statsArray);
    if (statsArray.length !== undefined) {
      var dbTimestamp = pgp.as.date(new Date());
      db.tx(function(t) {
        var deleteJoinsQuery = t.any(
          'DELETE from $1~ AS $2~ ' +
          'WHERE $3~=$4',
          ['repos_stats', 'rs', 'repo_id', repo.id]);
      
        var deleteStatsQuery = t.any(
          'DELETE from $1~ AS $2~ ' +
          'WHERE $3~=$4',
          ['stats', 's', 'repo_id', repo.id]);      
        
        var insertStatsAndJoinsQuery = statsArray.map(function(stat) {
          console.log('stat.author.id', stat.author.id);
          console.log('stat.total', stat.total);
          console.log('stat.weeks[0]', stat.weeks[0]);
          
          return t.any(
            'INSERT INTO $1~ ($2~, $3~, $4~, $5~) ' +
            'VALUES ($6, $7, $8, $9) ' +
            'RETURNING *',
            ['stats', 'updated_ga', 'author_id', 'total', 'weeks',
            dbTimestamp, stat.author.id, stat.total, JSON.stringify(stat.weeks)]);
        });
        
        // return t.batch(insertStatsAndJoinsQuery);
        var queryArray = [deleteJoinsQuery, deleteStatsQuery].concat(insertStatsAndJoinsQuery);
      })
      .then(data => {
        console.log('success in updateStatsInDb');
        // res.send('success');
        // db.any(
        //   'INSERT INTO $1~ ($2~, $3~, $4~) ' +
        //   'VALUES ($5, $6, $7) ' +
        //   'RETURNING *',
        //   ['repos_stats', 'created_ga', 'repo_id', 'stats_id_ga ',
        //   dbTimestamp, repo.id, statIdGa])
        //   .then(join => {
        //     console.log('join: ', join);
        //   })
        //   .catch(error => {
        //     console.error('Error in inserting stats and joins: ', error);
        //   });
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
    var owner;
    if (data[0] !== null) {
      owner = data[0].username;
    } else {
      owner = data[1].orgname;
    }
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
          getStatsFromGitHub(owner, repo, updateStatsInDb);
        });
        
        // TODO: remove this and use the forEach above
        // getStatsFromGitHub(owner, repos[0], updateStatsInDb);
        
        // test
        // getStatsFromGitHub('Groovy-Narwhal', 'GitAchieve', updateStatsInDb);
        

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
