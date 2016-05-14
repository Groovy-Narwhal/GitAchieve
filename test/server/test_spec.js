// var frisby = require('frisby');
// const CALLBACKHOST = require('../../server/config/config-settings').CALLBACKHOST;

// frisby.create('Get Users')
//   .get(`${CALLBACKHOST}/api/v1/users`)
//   .expectStatus(200)
//   .expectHeader('Content-Type', 'application/json; charset=utf-8')

// .toss();

// frisby.create('Get User By id')
//   .get(`${CALLBACKHOST}/api/v1/users/15220759`)
//   .expectStatus(200)
//   .expectHeader('Content-Type', 'application/json; charset=utf-8')
// .toss();

// frisby.create('Get Received Matches')
//   .get(`${CALLBACKHOST}/api/v1/users/15220759/receivedmatches`)
//   .expectStatus(200)
//   .expectHeader('Content-Type', 'application/json; charset=utf-8')
// .toss();

// frisby.create('Get Requested Matches')
//   .get(`${CALLBACKHOST}/api/v1/users/15220759/requestedmatches`)
//   .expectStatus(200)
//   .expectHeader('Content-Type', 'application/json; charset=utf-8')
// .toss();

// frisby.create('Post user')
//   .post(`${CALLBACKHOST}/api/v1/users/15220759`, {
//   }, {json: true})
//   .expectHeaderContains('Content-Type', 'text/html; charset=utf-8')
// .toss()

// frisby.create('Get Orgs')
//   .get(`${CALLBACKHOST}/api/v1/orgs/msmith9393/orgs`)
//   .expectStatus(200)
//   .expectHeader('Content-Type', 'application/json; charset=utf-8')
// .toss();

