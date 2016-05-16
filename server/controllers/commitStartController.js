const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const token = require('../config/github.config').token;
const rp = require('request-promise');
const moment = require('moment');

// GET at '/api/v1/users/:id/commits/start' to get a user's commits for a repo from a start date
// headers must include the 'repoid' and the 'startdate'
exports.retrieveCompetition = function(req, res) {
  var queryId = req.params.id;
  var startDate = new Date (req.headers.startdate);
  var repoId = req.headers.repoid;

  console.log("startDate and repoID:", startDate, repoId);

  db.any('SELECT sha, updated_ga, date, user_id, commit_message ' +
    'FROM commits_repos cr ' +
    'INNER JOIN commits c ' +
    'ON c.sha = cr.commit_sha ' +
    'WHERE cr.repo_id = $1 ' +
    'AND c.user_id = $2',
    [repoId, queryId])
    .then(commits => {
      // filter out commits that are before the start date
      var filteredCommits = commits.reduce((filtered, commit) => {
        if (new Date(commit.date) - startDate > 0) {
          filtered.push(commit);
          return filtered;
        } else {
          return filtered;
        }
      }, []);

      // establish start of competition - this will be the start of the day of the timestamp given
      var startMoment = moment(startDate).startOf('day');

      // establish end of competition - this is the end of today
      var endMoment = moment().endOf('day');
      console.log('endMoment: ', endMoment);
      // add each filtered commit to an object with the start of the day as the key
        // set the value to an empty array to hold the commits
      var days = endMoment.diff(startMoment, 'days');
      var commitHistory = {};
      for (var i = 0; i <= days; i++) {
        var dayStart = moment(startMoment).add(i, 'days').toString();
        commitHistory[dayStart] = [];
      }

      // add each commit to the correct day in the history
      filteredCommits.forEach(commit => {
        var commitDay = moment(commit.date).startOf('day');
        commitHistory[commitDay].push(commit);
      });

      // put the history into an unsorted array
      var unsortedHistory = [];
      for (var key in commitHistory) {
        var day = {day: new Date(key), commits: commitHistory[key]};
        unsortedHistory.push(day);
      }

      // sort the history by date and return
      var sortedHistory = unsortedHistory.sort((a, b) => a.day - b.day);
      res.send(sortedHistory);

    })
    .catch(error => {
      console.error('Error querying commits: ', error);
      res.status(500).send;
    });
};
