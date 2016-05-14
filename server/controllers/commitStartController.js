const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;
const rp = require('request-promise');

// GET at '/api/v1/users/:id/commits/start' to get a user's commits for a repo from a start date
// headers must include the 'repoid' and the 'startdate'
exports.retrieveCompetition = function(req, res) {
  var queryId = req.params.id;
  var startDate = req.headers.startdate;
  var repoid = req.headers.repoid;
  
  db.any('SELECT sha, updated_ga, date, user_id, commit_message ' +
    'FROM commits_repos cr ' +
    'INNER JOIN commits c' +
    'ON cr.repo_id = $1',
    [repoId])
    .then(commits => {
      res.send(commits);
    })
    .catch(error => {
      console.error('Error querying commits: ', error);
      res.status(500).send;
    }); 
};

var sampleDate = pgp.as.date(new Date());
console.log(new Date());

// new Date ()
// Fri May 13 2016 19:26:14 GMT-0700 (PDT)


// 'Sat, 14 May 2016 02:23:37 GMT'

console.log(new Date('Sat, 14 May 2016 02:23:37 GMT'));
