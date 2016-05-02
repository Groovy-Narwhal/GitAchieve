var express = require('express');
var path = require('path');
// var logger = require('logger');
// var fs = require('fs');
var http = require('http');
var router = express.Router();
var db = require('./db/database.js');

// Initiate server
var app = express();

// Passport Authentication and Middleware
require('./helpers/auth.js')(app);
require('./helpers/middleware.js')(app);

// Routers
var userRouter = require('./routers/userRouter.js');
var orgRouter = require('./routers/orgRouter.js');

// Use routers for specific paths
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/orgs', orgRouter);

app.use('/static', express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./client/index.html'));
});

// @todo: make sure this works -
// it should serve static assets (CSS, images, etc)
// app.use('/assets', express.static(__dirname + '../client/assets/'));

// Run server listening on the local environment
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening in on ', port);

module.exports = app;
