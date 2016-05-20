var express = require('express');
var path = require('path');
var http = require('http');
var router = express.Router();
var db = require('./db/database.js');

// Initiate server
var app = express();

// Passport Authentication and Middleware
require('./helpers/middleware.js')(app);
require('./helpers/auth.js')(app);
require('./helpers/userGHFetcher')(app);
require('./helpers/invitationSender')(app);

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

app.get('/*', function (req, res) {
  res.redirect('/');
});

// Run server listening on the local environment
var port = process.env.PORT || 8000;
var server = http.createServer(app);
server.listen(port);
console.log('GitAchieve server listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');

// socket.io
var io = require('socket.io')(server);
require('./helpers/socket')(io);

module.exports = app;
