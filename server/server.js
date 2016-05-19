const express = require('express');
const path = require('path');
const http = require('http');
const router = express.Router();
const db = require('./db/database.js');

// Initiate server
const app = express();

// Passport Authentication and Middleware
require('./helpers/middleware.js')(app);
require('./helpers/auth.js')(app);
require('./helpers/userGHFetcher')(app);
require('./helpers/invitationSender')(app);

// Routers
const userRouter = require('./routers/userRouter.js');
const orgRouter = require('./routers/orgRouter.js');

// Use routers for specific paths
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orgs', orgRouter);

app.use('/static', express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./client/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve('./client/index.html'));
});

// Run server listening on the local environment
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('GitAchieve server listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode');

// socket.io
var io = require('socket.io')(server);
require('./helpers/socket')(io);

module.exports = app;
