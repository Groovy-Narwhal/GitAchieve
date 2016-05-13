# GitAchieve [![Build Status](https://travis-ci.org/Groovy-Narwhal/GitAchieve.svg?branch=master)](https://travis-ci.org/Groovy-Narwhal/GitAchieve)
A webapp to promote positive Git behavior through friendly competition.
See GitAchieve in action at [**www.gitachieve.com**](http://www.gitachieve.com)

## Team
 - ![](https://avatars.githubusercontent.com/u/4149515?v=3&s=48)[**Inje Yeo**](https://github.com/byeo630)

 - ![](https://avatars.githubusercontent.com/u/15864056?v=3&s=48)[**Alex Nitta**](https://github.com/alexnitta)

 - ![](https://avatars.githubusercontent.com/u/10492144?v=3&s=48)[**Adam Isom**](https://github.com/adamrgisom)

 - ![](https://avatars.githubusercontent.com/u/15220759?v=3&s=48)[**Megan Smith**](https://github.com/msmith9393)

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
### Database Schema
For full details, see this [spreadsheet](https://docs.google.com/spreadsheets/d/1GPTzF5Bm_S3_2266Ib4b60NtqnQYp3_9fj6ODiP5INs/edit?usp=sharing)
![Schema](https://github.com/Groovy-Narwhal/GitAchieve/blob/master/server/db/sql/schema.png)
### API Server Endpoints
|Endpoint|Request Type|Description|JSON Required|Data Returned|
|---|---|---|---|---|
|/api/v1/users|GET|Get list of all users|none|Array of users|
|/api/v1/users|POST|Add a user|GitHub username, id and email|Added user|
|/api/v1/users/:id|GET|Get a user by id|none|User|
|/api/v1/users/:id|PATCH|Update a user with current GitHub info|none|Updated user|
|/api/v1/users/:id|DELETE|Delete a user by id|none|Deleted user|
|/api/v1/users/:id/repos|GET|Get a user's repos|none|Array of repos|
|/api/v1/users/:id/repos|POST|Add a repo for a user|Object containing 'profile', an object of all updated values|Added repo, added join|
|/api/v1/users/:id/friends|GET|Get a user's friends|none|
|/api/v1/users/:id/friends|POST|Primary user requests friendship with secondary user|primary user id, secondary user id, username and email|
|/api/v1/users/:id/friends|PATCH|Confirm a friend request or remove a friendship|remove:true to remove friendship|
|/api/v1/users/:id/stats|GET|Get stats for a user|none|
|/api/v1/users/:id/stats|PATCH|Update stats for a user|none|

### Client Side Routes
|Route|Description|Related Server Endpoints|
|---|---|---|
|/login|Login page with logo, tagline, and GitHub login button|Handled via passport in auth.js|

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
- Mocha/Chai
- JSHint

### Deployment
- AWS EC2
- Travis CI
