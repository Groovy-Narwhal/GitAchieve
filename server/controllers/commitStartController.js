const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;
const rp = require('request-promise');

// GET at '/api/v1/users/:id/commits/start' to get a user's commits for a repo from a start date
// headers must include the 'repoid' and the 'startdate'
exports.retrieveCompetition = function(req, res) {
  var queryId = req.params.id;
  var startDate = new Date (req.headers.startdate);
  var repoId = req.headers.repoid;
  
  
  db.any('SELECT sha, updated_ga, date, user_id, commit_message ' +
    'FROM commits_repos cr ' +
    'INNER JOIN commits c ' +
    'ON c.sha = cr.commit_sha ' +
    'WHERE cr.repo_id = $1 ' +
    'AND c.user_id = $2',
    [repoId, queryId])
    .then(commits => {
      var filteredCommits = commits.reduce((filtered, commit) => {
        if (new Date(commit.date) - startDate > 0) {
          console.log('startDate', startDate);
          console.log('commitDate', new Date(commit.date));
          console.log('--------');
          filtered.push(commit);
          return filtered;
        } else {
          return filtered;
        }       
      }, []);
      res.send(filteredCommits);
    })
    .catch(error => {
      console.error('Error querying commits: ', error);
      res.status(500).send;
    }); 
};

var sampleDate = pgp.as.date(new Date());
console.log(new Date(new Date() - 6 * 1000 * 1 * 60 * 60 * 24));

// new Date ()
// Fri May 13 2016 19:26:14 GMT-0700 (PDT)


// 'Sat, 14 May 2016 02:23:37 GMT'

console.log(new Date('Sat, 14 May 2016 02:23:37 GMT'));

var d1 = new Date(); //"now"
var d2 = new Date("2016/05/10")  // some date
var diff = (d1 - d2)/(1000 * 1 * 60 * 60 * 24);  
console.log(diff);
