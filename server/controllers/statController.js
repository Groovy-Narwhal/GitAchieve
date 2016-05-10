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
  
  //  helper function to get the stats for a given owner & repo from GitHub
  var getStatsFromGitHub = function(owner, repo, callback) {
    var options = {
      url: 'https://api.github.com/repos/' + owner + '/' + repo + '/stats/contributors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        // Uncomment this line to make GET requests from within the site (not with Postman)
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        callback(repo, body);
      }
    });
  };
    
  var addStatsToDb = function(repo, stats, callback) {
    var dbTimestamp = pgp.as.date(new Date());
    
    // delete existing joins from repos_stats - NOTE: there's no way to identify which rows to delete 
    // with current schema - do we need to add an owner_id and repo_id to each join row?
    db.tx(function(t)) {
      var queries1 = stats.map(stat => {
        return t.any(
          'DELETE from $1~ ' +
          'WHERE $2~ = $3 ' +
          'AND $4~ = $5'
          ['repos_stats', 'repo_id', ]
          )  
      })
    }
    
    // delete existing stats
    
    // insert stats
    db.tx(function(t) {
      var queries2 = stats.map(stat => {
        return t.any(
          'INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~) ' +
          'VALUES ($8, $9, $10, $11, $12) ' +
          ['stats', 's', 'updated_ga', 'repo_id', 'author_id', 'total', 'weeks',
          dbTimestamp, repo.id, stat.author.id, stat.total, stat.weeks]
          )
      })
    })

    // insert join rows

  };
    
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
    var ownerId;
    if (data[0] !== null) {
      owner = data[0].username;
      ownerId = data[0].id;
    } else {
      owner = data[1].orgname;
      ownerId = data[1].id;
    }
    
    // get the repos from our db for the owner
    db.any(
      'SELECT * FROM $1~ ' +
      'WHERE $2~ = $3'
      ['repos', 'owner', owner])
      .then(repos => {
        // for each repo, make a GET request to GitHub at /repos/:owner/:repo/stats/contributors
        // add stats to our db
        // add a join to our db for repos_stats
        repos.forEach(repo => {
          getStatsFromGitHub(owner, repo.name, )
        })
        
        
        
      })
    
      
            
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error selecting owner');
  })

};
