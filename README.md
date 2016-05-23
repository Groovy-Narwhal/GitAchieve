# GitAchieve [![Build Status](https://travis-ci.org/Groovy-Narwhal/GitAchieve.svg?branch=master)](https://travis-ci.org/Groovy-Narwhal/GitAchieve) [![Dependency Status](https://david-dm.org/Groovy-Narwhal/GitAchieve.svg?style=flat)](https://david-dm.org/Groovy-Narwhal/GitAchieve)
A webapp to promote positive Git behavior through friendly competition.
See GitAchieve in action at [**www.gitachieve.com**](http://www.gitachieve.com)

![Demo](https://github.com/Groovy-Narwhal/GitAchieve/blob/master/docs/GA-demo-1-1.gif)

## Team
- <img src="https://avatars.githubusercontent.com/u/4149515?v=3" width="64"> [**Inje Yeo**] (https://github.com/byeo630)

- <img src="https://avatars.githubusercontent.com/u/15864056?v=3" width="64"> [**Alex Nitta**](https://github.com/alexnitta)

- <img src="https://avatars.githubusercontent.com/u/10492144?v=3" width="64"> [**Adam Isom**](https://github.com/adamrgisom)

- <img src="https://avatars.githubusercontent.com/u/15220759?v=3" width="64"> [**Megan Smith**](https://github.com/msmith9393)


## Table of Contents
1. [How to get started](#how-to-get-started)
1. [Architecture](#architecture)
1. [Technologies](#technologies)


## How to get started
1. Clone down the repo `git clone https://github.com/Groovy-Narwhal/GitAchieve.git`
2. Change directory into GitAchieve `cd GitAchieve/`
3. Install dependencies `npm install`
4. Run the server `npm run serve`
5. Open your browser to `localhost:8000`


## Architecture
### API Server Endpoints
|Endpoint|Request Type|Description|JSON Required|Data Returned|
|---|---|---|---|---|
|/api/v1/users|GET|Get list of all users|none|Array of users|
|/api/v1/users|POST|Add a user|GitHub username, id and email|Added user|
|/api/v1/users/:id|GET|Get a user by id|none|User|
|/api/v1/users/:id|PATCH|Update a user manually|Object of updated properties|Updated user|
|/api/v1/users/:id|PATCH|Update a user automatically with current GitHub info|none|Updated user|
|/api/v1/users/:id|DELETE|Delete a user by id|none|Deleted user|
|/api/v1/users/:id/repo|GET|Get a single repo by id for a user|Header for `repoid`|Array containing repo|
|/api/v1/users/:id/repos|GET|Get a user's repos|none|Array of repos|
|/api/v1/users/:id/repos|POST|Add a repo for a user|Object containing 'profile', an object of all updated values|Added repo, added join|
|/api/v1/users/:id/repos|PATCH|Update a user's repos from GitHub by user id|none|Array of repos|
|/api/v1/users/:id/repos/branches|GET|Get a repo's branches by user id and repo id|Header for `repoid`|Array of branches|
|/api/v1/users/:id/repos/branches|PATCH|Update branches for a user's repos from GitHub|none|Array of branches updated|
|/api/v1/users/:id/stats|GET|Get stats for a user by org and repo|Headers for `orgid` and `repoid`|Array containing stat object|
|/api/v1/users/:id/stats|PATCH|Update stats for a user from GitHub |none|Array of stats updated - each has user_id, org_id and repo_id|
|/api/v1/users/:id/commits|GET|Get commits for a user by repo|Header for `repoid`|Array containing commits, sorted by most recent first|
|/api/v1/users/:id/commits|PATCH|Update commits for a user from GitHub|none|Array of commits updated|
|/api/v1/users/:id/commits/start|GET|Get commits for a user by repo from start date|Header for `repoid` and `startdate`|Array of objects containing date and commits for each day|
|/api/v1/users/:id/friends|GET|Get a user's friends|none|Array of friends|
|/api/v1/users/:id/friends|POST|Primary user requests friendship with secondary user|primary user id, secondary user id, username and email|Array containing join row in users_users|
|/api/v1/users/:id/friends|PATCH|Confirm a friend request or remove a friendship|remove:true to remove friendship|Array containing join row in users_users|
|/api/v1/users/:id/receivedmatches|GET|Retrieve all friendships in which you were requested to compete|none|Array of users_users|
|/api/v1/users/:id/requestedmatches|GET|Retrieve all friendships in which you requested to compete with someone|none|Array of users_users|
|/api/v1/users/:id/successmatches|GET|Retrieve all friendships that have been accepted in which you sent the request|none|Array of users_users|
|/api/v1/users/:id/successmatches2|GET|Retrieve all friendships that have been accepted in which you were sent the request|none|Array of users_users|
|/api/v1/users/:id/pastcompetitions|GET|Retrieve all competitions that have passed|none|Array of users_users|
|/api/v1/orgs/:id/orgs|PATCH|Update organizations for user|none|Array of organizations|
|/api/v1/orgs/:id/pullrequests|PATCH|Update pull requests for user|none|Array of pull request data for user|
|/api/v1/orgs/:username/orgs|GET|Get all of users organizations|none|Array of organizations data|
|/api/v1/orgs/:username/pullrequests|GET|Get all of users pull requests|none|Array of pullrequest data|

### Client Side Routes
|Route|Description|
|---|---|
|/|Index route displaying search for opponent, achievement chart, competitor challenges |
|/signin|Login page with logo, tagline, and GitHub login button|Handled via passport in auth.js|
|/about|About page with info on what GitAchieve is and the team|
|/search-results|List of users search results|
|/:username/profile|Users profile page|
|/:username/achievements|Users achievement profile|
|/compete/choose-repo/:username|Dropdown for first user to select repo and start time of competition|
|/compete/choose-second-repo/:id|Dropdown for second user to select repo|

### System Architecture
![System Architecture](https://github.com/Groovy-Narwhal/GitAchieve/blob/master/docs/systemArchitecture.png)
### Database Schema
For full details, see this [spreadsheet](https://docs.google.com/spreadsheets/d/1GPTzF5Bm_S3_2266Ib4b60NtqnQYp3_9fj6ODiP5INs/edit?usp=sharing)

![Schema](https://github.com/Groovy-Narwhal/GitAchieve/blob/master/docs/schema.png)


## Technologies
### Front End
- React
- Redux
- D3.js


### Back End
- NodeJS
- ExpressJS
- Postgres


### Testing
- Back End Tests
  -  Frisby.js - [http://frisbyjs.com/]
    - REST API Testing framework built on node.js and Jasmine
    - npm install -g jasmine-node
    - run from command line - jasmine-node test/server
- Front End Tests
  - Expect - [https://github.com/mjackson/expect]
  - Enzyme with Mocha - [https://github.com/airbnb/enzyme]


### Deployment
- AWS EC2
- Travis CI
