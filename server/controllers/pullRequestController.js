// for each organization in the organizations table that the user belongs to make that organization the owner
// then go through each repo of each organization and make that repo the repo

// search through data and insert into the pull request table if merged_at does not equal null
// github endpoint /repos/:owner/:repo/pulls?state=all

const request = require('request');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;
const PORT = require('../config/config-settings').PORT;
const HOST = require('../config/config-settings').HOST;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;

const orgController = require('./orgController');


// /api/v1/users/orgs/:id/pullrequsts
exports.retrievePullRequests = (req, res) => {
  const dbTimestamp = pgp.as.date(new Date());
  const username = req.body.profile.username;

  // helper functions
  const addPR = (prs, callback) => {
    console.log('prs in RPR', prs)
    db.tx(task => {
      const queries = prs.map(pr => {
        return task.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~, $9~, $10~) ' +
          'VALUES ($11, $12, $13, $14, $15, $16, $17, $18) ' +
          'ON CONFLICT ($3~) ' +
          'DO UPDATE SET ($4~, $5~, $6~, $7~, $8~, $9~, $10~) = ($12, $13, $14, $15, $16, $17, $18) ' +
          'WHERE $2~.$3~ = $11',
          ['pull_requests', 'pr', 'id', 'updated_ga', 'user_id', 'state', 'diff_url', 'created_at', 'closed_at', 'milestone',
          pr.id, dbTimestamp, pr.user.id, pr.state, pr.diff_url, pr.created_at, pr.merged_at, pr.milestone]);
      });
    })
    .then(data => {
      console.log('Successfully added pull requests!');
      console.log('DATA IN RPQ', data)
      callback(data);
    })
    .catch(error => {
      console.log('Did not successfully add pull requests');
      console.error(error);
    })
  }


  // get user info from GitHub
  var getPRSFromGitHub = (owner, repo, callback) => {
    var options = {
      url: `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': username,
        'Authorization': `token ${req.body.token}`
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error('error: ', error);
      } else {
        console.log('body in request', body)
        callback(body);
      }
    });
  };

  // gather the helper functions together into one asynchronous series
  const handleGitHubData = data => {
    console.log('DATA', data);
    var prs = JSON.parse(data);
    addPR(prs, function(dat) {
      console.log('what up!');
      console.log('dat', dat);
    })
  }

  db.any('SELECT o.orgname FROM orgs o INNER JOIN users_orgs uo ON ' +
    '(o.id=uo.org_id) INNER JOIN users u on (uo.user_id=u.id) WHERE u.username=$1', [username])
    .then(data => {
      data.forEach(org => {
        if (org.orgname !== 'hackreactor') {
          var membersOptions = {
            url: `https://api.github.com/orgs/${org.orgname}/members`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': username,
              'Authorization': `token ${req.body.token}`
            }
          };
          request(membersOptions, (error, response, body) => {
            if (error) {
              console.error('error: ', error);
            } else {
              const parsedBody = JSON.parse(body);
              parsedBody.forEach(member => {
                // if user exists, update their info; otherwise, add them
                // this is an 'upsert' - it will insert a record if it does not exist, or update it if it exists
                  db.one('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~, $9~) ' +
                    'VALUES ($10, $11, $12, $13, $14, $15, $16) ' +
                    'ON CONFLICT ($3~) ' + 
                    'DO UPDATE SET ($17~, $5~, $6~, $7~, $8~, $9~) = ($11, $12, $13, $14, $15, $16) ' +
                    'WHERE $2~.$3~ = $10 ' +
                    'RETURNING *',
                    ['users', 'u', 'id', 'updated_ga', 'username', 'email', 'avatar_url', 'followers', 'following', 'signed_up',
                    queryId, false, dbTimestamp, username, body.email, body.avatar_url, body.followers, body.following, 'created_ga'])
                  .then((data) => {
                    res.send(data);
                  })
                  .catch((error) => {
                    // if the user was not found, send 404
                    console.error(error);
                    if (error.code === 0) {
                      res.status(404).send('User does not exist');
                    } else {
                      res.status(500).send('Error searching database for user');
                    }
                  });






              })
            }
          });
        }
          // var options = {
          //   url: `https://api.github.com/orgs/${org.orgname}/repos`,
          //   method: 'GET',
          //   headers: {
          //     'Content-Type': 'application/x-www-form-urlencoded',
          //     'User-Agent': username,
          //     'Authorization': `token ${req.body.token}`
          //   }
          // };
          // request(options, (error, response, body) => {
          //   if (error) {
          //     console.error('error: ', error);
          //   } else {
          //     const parsedBody = JSON.parse(body);
          //     parsedBody.forEach(repo => {console.log('what up')})
          //     // console.log('BODYDYDYDYDY', Array.isArray(parsedBody));
          //   }
          // });
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error reading orgs table');
    });
  // call helper functions
  // getPRSFromGitHub('Groovy-Narwhal', 'GitAchieve', handleGitHubData);

};






// {

//     "url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33",
//     "id": 69386634,
//     "html_url": "https://github.com/Groovy-Narwhal/GitAchieve/pull/33",
//     "diff_url": "https://github.com/Groovy-Narwhal/GitAchieve/pull/33.diff",
//     "patch_url": "https://github.com/Groovy-Narwhal/GitAchieve/pull/33.patch",
//     "issue_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/33",
//     "number": 33,
//     "state": "closed",
//     "locked": false,
//     "title": "(Feat) add avatar_url to orgs schema, fix error in database.js",
//     "user": {
//       "login": "alexnitta",
//       "id": 15864056,
//       "avatar_url": "https://avatars.githubusercontent.com/u/15864056?v=3",
//       "gravatar_id": "",
//       "url": "https://api.github.com/users/alexnitta",
//       "html_url": "https://github.com/alexnitta",
//       "followers_url": "https://api.github.com/users/alexnitta/followers",
//       "following_url": "https://api.github.com/users/alexnitta/following{/other_user}",
//       "gists_url": "https://api.github.com/users/alexnitta/gists{/gist_id}",
//       "starred_url": "https://api.github.com/users/alexnitta/starred{/owner}{/repo}",
//       "subscriptions_url": "https://api.github.com/users/alexnitta/subscriptions",
//       "organizations_url": "https://api.github.com/users/alexnitta/orgs",
//       "repos_url": "https://api.github.com/users/alexnitta/repos",
//       "events_url": "https://api.github.com/users/alexnitta/events{/privacy}",
//       "received_events_url": "https://api.github.com/users/alexnitta/received_events",
//       "type": "User",
//       "site_admin": false
//     },
//     "body": "",
//     "created_at": "2016-05-09T18:12:39Z",
//     "updated_at": "2016-05-09T18:17:11Z",
//     "closed_at": "2016-05-09T18:17:11Z",
//     "merged_at": "2016-05-09T18:17:11Z",
//     "merge_commit_sha": "f987c7116a7e578faccffe57732cb998233a57de",
//     "assignee": {
//       "login": "msmith9393",
//       "id": 15220759,
//       "avatar_url": "https://avatars.githubusercontent.com/u/15220759?v=3",
//       "gravatar_id": "",
//       "url": "https://api.github.com/users/msmith9393",
//       "html_url": "https://github.com/msmith9393",
//       "followers_url": "https://api.github.com/users/msmith9393/followers",
//       "following_url": "https://api.github.com/users/msmith9393/following{/other_user}",
//       "gists_url": "https://api.github.com/users/msmith9393/gists{/gist_id}",
//       "starred_url": "https://api.github.com/users/msmith9393/starred{/owner}{/repo}",
//       "subscriptions_url": "https://api.github.com/users/msmith9393/subscriptions",
//       "organizations_url": "https://api.github.com/users/msmith9393/orgs",
//       "repos_url": "https://api.github.com/users/msmith9393/repos",
//       "events_url": "https://api.github.com/users/msmith9393/events{/privacy}",
//       "received_events_url": "https://api.github.com/users/msmith9393/received_events",
//       "type": "User",
//       "site_admin": false
//     },
//     "milestone": null,
//     "commits_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33/commits",
//     "review_comments_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33/comments",
//     "review_comment_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/comments{/number}",
//     "comments_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/33/comments",
//     "statuses_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/statuses/2208915c31aa9ccf849ce223a15a0dbe8a282237",
//     "head": {
//       "label": "alexnitta:feat/dbSetup3",
//       "ref": "feat/dbSetup3",
//       "sha": "2208915c31aa9ccf849ce223a15a0dbe8a282237",
//       "user": {
//         "login": "alexnitta",
//         "id": 15864056,
//         "avatar_url": "https://avatars.githubusercontent.com/u/15864056?v=3",
//         "gravatar_id": "",
//         "url": "https://api.github.com/users/alexnitta",
//         "html_url": "https://github.com/alexnitta",
//         "followers_url": "https://api.github.com/users/alexnitta/followers",
//         "following_url": "https://api.github.com/users/alexnitta/following{/other_user}",
//         "gists_url": "https://api.github.com/users/alexnitta/gists{/gist_id}",
//         "starred_url": "https://api.github.com/users/alexnitta/starred{/owner}{/repo}",
//         "subscriptions_url": "https://api.github.com/users/alexnitta/subscriptions",
//         "organizations_url": "https://api.github.com/users/alexnitta/orgs",
//         "repos_url": "https://api.github.com/users/alexnitta/repos",
//         "events_url": "https://api.github.com/users/alexnitta/events{/privacy}",
//         "received_events_url": "https://api.github.com/users/alexnitta/received_events",
//         "type": "User",
//         "site_admin": false
//       },
//       "repo": {
//         "id": 57170026,
//         "name": "GitAchieve",
//         "full_name": "alexnitta/GitAchieve",
//         "owner": {
//           "login": "alexnitta",
//           "id": 15864056,
//           "avatar_url": "https://avatars.githubusercontent.com/u/15864056?v=3",
//           "gravatar_id": "",
//           "url": "https://api.github.com/users/alexnitta",
//           "html_url": "https://github.com/alexnitta",
//           "followers_url": "https://api.github.com/users/alexnitta/followers",
//           "following_url": "https://api.github.com/users/alexnitta/following{/other_user}",
//           "gists_url": "https://api.github.com/users/alexnitta/gists{/gist_id}",
//           "starred_url": "https://api.github.com/users/alexnitta/starred{/owner}{/repo}",
//           "subscriptions_url": "https://api.github.com/users/alexnitta/subscriptions",
//           "organizations_url": "https://api.github.com/users/alexnitta/orgs",
//           "repos_url": "https://api.github.com/users/alexnitta/repos",
//           "events_url": "https://api.github.com/users/alexnitta/events{/privacy}",
//           "received_events_url": "https://api.github.com/users/alexnitta/received_events",
//           "type": "User",
//           "site_admin": false
//         },
//         "private": false,
//         "html_url": "https://github.com/alexnitta/GitAchieve",
//         "description": "A website to gamify Git.",
//         "fork": true,
//         "url": "https://api.github.com/repos/alexnitta/GitAchieve",
//         "forks_url": "https://api.github.com/repos/alexnitta/GitAchieve/forks",
//         "keys_url": "https://api.github.com/repos/alexnitta/GitAchieve/keys{/key_id}",
//         "collaborators_url": "https://api.github.com/repos/alexnitta/GitAchieve/collaborators{/collaborator}",
//         "teams_url": "https://api.github.com/repos/alexnitta/GitAchieve/teams",
//         "hooks_url": "https://api.github.com/repos/alexnitta/GitAchieve/hooks",
//         "issue_events_url": "https://api.github.com/repos/alexnitta/GitAchieve/issues/events{/number}",
//         "events_url": "https://api.github.com/repos/alexnitta/GitAchieve/events",
//         "assignees_url": "https://api.github.com/repos/alexnitta/GitAchieve/assignees{/user}",
//         "branches_url": "https://api.github.com/repos/alexnitta/GitAchieve/branches{/branch}",
//         "tags_url": "https://api.github.com/repos/alexnitta/GitAchieve/tags",
//         "blobs_url": "https://api.github.com/repos/alexnitta/GitAchieve/git/blobs{/sha}",
//         "git_tags_url": "https://api.github.com/repos/alexnitta/GitAchieve/git/tags{/sha}",
//         "git_refs_url": "https://api.github.com/repos/alexnitta/GitAchieve/git/refs{/sha}",
//         "trees_url": "https://api.github.com/repos/alexnitta/GitAchieve/git/trees{/sha}",
//         "statuses_url": "https://api.github.com/repos/alexnitta/GitAchieve/statuses/{sha}",
//         "languages_url": "https://api.github.com/repos/alexnitta/GitAchieve/languages",
//         "stargazers_url": "https://api.github.com/repos/alexnitta/GitAchieve/stargazers",
//         "contributors_url": "https://api.github.com/repos/alexnitta/GitAchieve/contributors",
//         "subscribers_url": "https://api.github.com/repos/alexnitta/GitAchieve/subscribers",
//         "subscription_url": "https://api.github.com/repos/alexnitta/GitAchieve/subscription",
//         "commits_url": "https://api.github.com/repos/alexnitta/GitAchieve/commits{/sha}",
//         "git_commits_url": "https://api.github.com/repos/alexnitta/GitAchieve/git/commits{/sha}",
//         "comments_url": "https://api.github.com/repos/alexnitta/GitAchieve/comments{/number}",
//         "issue_comment_url": "https://api.github.com/repos/alexnitta/GitAchieve/issues/comments{/number}",
//         "contents_url": "https://api.github.com/repos/alexnitta/GitAchieve/contents/{+path}",
//         "compare_url": "https://api.github.com/repos/alexnitta/GitAchieve/compare/{base}...{head}",
//         "merges_url": "https://api.github.com/repos/alexnitta/GitAchieve/merges",
//         "archive_url": "https://api.github.com/repos/alexnitta/GitAchieve/{archive_format}{/ref}",
//         "downloads_url": "https://api.github.com/repos/alexnitta/GitAchieve/downloads",
//         "issues_url": "https://api.github.com/repos/alexnitta/GitAchieve/issues{/number}",
//         "pulls_url": "https://api.github.com/repos/alexnitta/GitAchieve/pulls{/number}",
//         "milestones_url": "https://api.github.com/repos/alexnitta/GitAchieve/milestones{/number}",
//         "notifications_url": "https://api.github.com/repos/alexnitta/GitAchieve/notifications{?since,all,participating}",
//         "labels_url": "https://api.github.com/repos/alexnitta/GitAchieve/labels{/name}",
//         "releases_url": "https://api.github.com/repos/alexnitta/GitAchieve/releases{/id}",
//         "deployments_url": "https://api.github.com/repos/alexnitta/GitAchieve/deployments",
//         "created_at": "2016-04-27T00:00:30Z",
//         "updated_at": "2016-04-28T00:20:34Z",
//         "pushed_at": "2016-05-09T18:11:56Z",
//         "git_url": "git://github.com/alexnitta/GitAchieve.git",
//         "ssh_url": "git@github.com:alexnitta/GitAchieve.git",
//         "clone_url": "https://github.com/alexnitta/GitAchieve.git",
//         "svn_url": "https://github.com/alexnitta/GitAchieve",
//         "homepage": null,
//         "size": 2101,
//         "stargazers_count": 0,
//         "watchers_count": 0,
//         "language": "JavaScript",
//         "has_issues": false,
//         "has_downloads": true,
//         "has_wiki": true,
//         "has_pages": false,
//         "forks_count": 0,
//         "mirror_url": null,
//         "open_issues_count": 0,
//         "forks": 0,
//         "open_issues": 0,
//         "watchers": 0,
//         "default_branch": "master"
//       }
//     },
//     "base": {
//       "label": "Groovy-Narwhal:master",
//       "ref": "master",
//       "sha": "8014104d7d88345f4352e9539e714a70f64b9089",
//       "user": {
//         "login": "Groovy-Narwhal",
//         "id": 18689532,
//         "avatar_url": "https://avatars.githubusercontent.com/u/18689532?v=3",
//         "gravatar_id": "",
//         "url": "https://api.github.com/users/Groovy-Narwhal",
//         "html_url": "https://github.com/Groovy-Narwhal",
//         "followers_url": "https://api.github.com/users/Groovy-Narwhal/followers",
//         "following_url": "https://api.github.com/users/Groovy-Narwhal/following{/other_user}",
//         "gists_url": "https://api.github.com/users/Groovy-Narwhal/gists{/gist_id}",
//         "starred_url": "https://api.github.com/users/Groovy-Narwhal/starred{/owner}{/repo}",
//         "subscriptions_url": "https://api.github.com/users/Groovy-Narwhal/subscriptions",
//         "organizations_url": "https://api.github.com/users/Groovy-Narwhal/orgs",
//         "repos_url": "https://api.github.com/users/Groovy-Narwhal/repos",
//         "events_url": "https://api.github.com/users/Groovy-Narwhal/events{/privacy}",
//         "received_events_url": "https://api.github.com/users/Groovy-Narwhal/received_events",
//         "type": "Organization",
//         "site_admin": false
//       },
//       "repo": {
//         "id": 57168838,
//         "name": "GitAchieve",
//         "full_name": "Groovy-Narwhal/GitAchieve",
//         "owner": {
//           "login": "Groovy-Narwhal",
//           "id": 18689532,
//           "avatar_url": "https://avatars.githubusercontent.com/u/18689532?v=3",
//           "gravatar_id": "",
//           "url": "https://api.github.com/users/Groovy-Narwhal",
//           "html_url": "https://github.com/Groovy-Narwhal",
//           "followers_url": "https://api.github.com/users/Groovy-Narwhal/followers",
//           "following_url": "https://api.github.com/users/Groovy-Narwhal/following{/other_user}",
//           "gists_url": "https://api.github.com/users/Groovy-Narwhal/gists{/gist_id}",
//           "starred_url": "https://api.github.com/users/Groovy-Narwhal/starred{/owner}{/repo}",
//           "subscriptions_url": "https://api.github.com/users/Groovy-Narwhal/subscriptions",
//           "organizations_url": "https://api.github.com/users/Groovy-Narwhal/orgs",
//           "repos_url": "https://api.github.com/users/Groovy-Narwhal/repos",
//           "events_url": "https://api.github.com/users/Groovy-Narwhal/events{/privacy}",
//           "received_events_url": "https://api.github.com/users/Groovy-Narwhal/received_events",
//           "type": "Organization",
//           "site_admin": false
//         },
//         "private": false,
//         "html_url": "https://github.com/Groovy-Narwhal/GitAchieve",
//         "description": "A website to gamify Git.",
//         "fork": false,
//         "url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve",
//         "forks_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/forks",
//         "keys_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/keys{/key_id}",
//         "collaborators_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/collaborators{/collaborator}",
//         "teams_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/teams",
//         "hooks_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/hooks",
//         "issue_events_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/events{/number}",
//         "events_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/events",
//         "assignees_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/assignees{/user}",
//         "branches_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/branches{/branch}",
//         "tags_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/tags",
//         "blobs_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/git/blobs{/sha}",
//         "git_tags_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/git/tags{/sha}",
//         "git_refs_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/git/refs{/sha}",
//         "trees_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/git/trees{/sha}",
//         "statuses_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/statuses/{sha}",
//         "languages_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/languages",
//         "stargazers_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stargazers",
//         "contributors_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/contributors",
//         "subscribers_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/subscribers",
//         "subscription_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/subscription",
//         "commits_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/commits{/sha}",
//         "git_commits_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/git/commits{/sha}",
//         "comments_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/comments{/number}",
//         "issue_comment_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/comments{/number}",
//         "contents_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/contents/{+path}",
//         "compare_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/compare/{base}...{head}",
//         "merges_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/merges",
//         "archive_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/{archive_format}{/ref}",
//         "downloads_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/downloads",
//         "issues_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues{/number}",
//         "pulls_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls{/number}",
//         "milestones_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/milestones{/number}",
//         "notifications_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/notifications{?since,all,participating}",
//         "labels_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/labels{/name}",
//         "releases_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/releases{/id}",
//         "deployments_url": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/deployments",
//         "created_at": "2016-04-26T23:30:21Z",
//         "updated_at": "2016-04-27T22:56:38Z",
//         "pushed_at": "2016-05-09T18:52:34Z",
//         "git_url": "git://github.com/Groovy-Narwhal/GitAchieve.git",
//         "ssh_url": "git@github.com:Groovy-Narwhal/GitAchieve.git",
//         "clone_url": "https://github.com/Groovy-Narwhal/GitAchieve.git",
//         "svn_url": "https://github.com/Groovy-Narwhal/GitAchieve",
//         "homepage": null,
//         "size": 2102,
//         "stargazers_count": 0,
//         "watchers_count": 0,
//         "language": "JavaScript",
//         "has_issues": true,
//         "has_downloads": true,
//         "has_wiki": true,
//         "has_pages": false,
//         "forks_count": 5,
//         "mirror_url": null,
//         "open_issues_count": 0,
//         "forks": 5,
//         "open_issues": 0,
//         "watchers": 0,
//         "default_branch": "master"
//       }
//     },
//     "_links": {
//       "self": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33"
//       },
//       "html": {
//         "href": "https://github.com/Groovy-Narwhal/GitAchieve/pull/33"
//       },
//       "issue": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/33"
//       },
//       "comments": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/issues/33/comments"
//       },
//       "review_comments": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33/comments"
//       },
//       "review_comment": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/comments{/number}"
//       },
//       "commits": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/pulls/33/commits"
//       },
//       "statuses": {
//         "href": "https://api.github.com/repos/Groovy-Narwhal/GitAchieve/statuses/2208915c31aa9ccf849ce223a15a0dbe8a282237"
//       }
//     }
//   }