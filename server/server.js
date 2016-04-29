var express = require('express');
var path = require('path');
var config = require('../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportGH = require('passport-github');
var morgan = require('morgan');
var logger = require('logger');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var db = require('./db/database.js');

// Routers
var userRouter = require('./routers/userRouter.js');
var orgRouter = require('./routers/orgRouter.js');

// Initiate server
var app = express();
var compiler = webpack(config);

http.createServer(app).listen(8080);


// test database
db.createUserTable();


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('./dist'));
app.use('/', function(req, res) {
  res.sendFile(path.resolve('./client/index.html'));
});
app.use('/static', express.static(__dirname + '/../client'));

// Use routers for specific paths
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orgname', orgRouter);

// Run server listening on the local environment
const port = process.env.PORT || 8000;
console.log('Listening in on ', port);
app.listen(port);

module.exports = app;
