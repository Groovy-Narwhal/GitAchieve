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

// Initiate server
var app = express();
var compiler = webpack(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('./dist'));
app.use('/', function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

const port = process.env.PORT || 8000;
console.log('Listening in on ', port);
app.listen(port);

module.exports = app;
