const db = require('../db/database.js').db;

// get the owner information for each repo
// this will allow us to set up the GitHub GET requests in commitController and branchController
module.exports = (queryId, callback) => {
  // get the user for this queryId
  db.one('SELECT * from $1~ ' +
    'WHERE $2~=$3',
    ['users', 'id', queryId])
    // get the repos for this user
    .then(user => {
      db.any('SELECT r.id, r.owner_id, r.name ' +
        'FROM users_repos ur ' +
        'INNER JOIN repos r ' +
        'ON r.id = ur.repo_id ' +
        'WHERE ur.user_id=$1',
        [queryId])
        .then(repos => {
          var repoCountGetRepoOwners = 0;
          var totalRepos = repos.length;
          var ownerName = user.username;
          var repoName = '';
          var repoOwners = [];
          // set up a hash of each repo's ownership info
          repos.forEach(repo => {
            db.oneOrNone('SELECT * FROM $1~ ' +
              'WHERE $2~=$3',
              ['orgs', 'id', repo.owner_id])
              .then(org => {
                if (org !== null) {
                  repoOwners.push({
                    repoId: repo.id,
                    repoName: repo.name,
                    userName: user.username,
                    userId: user.id,
                    orgId: org.id,
                    orgName: org.orgname,
                    repoOwnerId: repo.owner_id
                  });
                } else {
                  repoOwners.push({
                    repoId: repo.id,
                    repoName: repo.name,
                    userName: user.username,
                    userId: user.id,
                    orgId: null,
                    orgName: null,
                    repoOwnerId: repo.owner_id
                  });
                }
              })
              .then(data => {
                repoCountGetRepoOwners++;
                if (repoCountGetRepoOwners === totalRepos) {
                  callback(repoOwners);
                }
              })  
              .catch(error => {
                console.error('Error selecting orgs: ', error);
                res.status(500).send('Error selecting orgs');
              });
          });
        })  
        .catch(error => {
          console.error('Error selecting repos: ', error);
          res.status(500).send('Error selecting repos');
        });       
    })
    .catch(error => {
      console.error('Error selecting user: ', error);
      res.status(500).send('Error selecting user');
    });
};
