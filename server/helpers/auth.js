var PORT = require('../config/config-settings').PORT;
var CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
var request = require('request');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-github2').Strategy;
var keys = require('./../config/github.config.js');
var session = require('express-session');
var db = require('../db/database.js').db;
var pgp = require('../db/database.js').pgp;
var massiveFetch = require('./massiveFetch');

// helper function to be used in Passport authentication as a callback
// adds a user to the database, if they don't already exist
// also updates their repos in our database
var getOrAddUser = function(accessToken, refreshToken, profile, callback) {
  var id = profile._json.id;
  var dbTimestamp = pgp.as.date(new Date());
  var username = profile._json.login;
  var email = profile._json.email;
  var avatar_url = profile._json.avatar_url;
  var followers = profile._json.followers;
  var following = profile._json.following;

  // add the user to our database, or update them if they already exist
  db.any('INSERT INTO users AS u (id, username, email, created_ga, updated_ga, signed_up, avatar_url, followers, following) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
    'ON CONFLICT (id) ' +
    'DO UPDATE SET (username, email, updated_ga, signed_up, avatar_url, followers, following) = ($2, $3, $4, $6, $7, $8, $9) ' +
    'WHERE u.id = $1',
    [id, username, email, dbTimestamp, null, true, avatar_url, followers, following])
    .then((data) => {
      return callback(null, {data: profile._json, token: accessToken});    
    })
    .then(() => {
      // call massive fetch to update our database with user's GitHub data for repos, orgs, pull
      // requests, stats, and commits
      // we are sending true as the last argument to run the requests sequentially - if any of
      // them fail, the rest will fail
      massiveFetch(id, username, accessToken, profile, true, massiveFetchSuccess => {
        if (massiveFetchSuccess) {
          console.log('MF: All user info successfully updated from GitHub');
        } else {
          console.error('MF: errors in updating user info from GitHub');
        }     
      }); 
    })
    .catch((error) => {
      console.error('Error in auth user upsert: ', error);
    });
};

module.exports = function(app) {
  app.use(cookieParser());
  app.use(session({
    secret: 'groovy-narwhal',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    if (user) {
      cb(null, user);
    } else {
      cb('User not found', null);
    }
  });
  
  passport.use(new Strategy({
    clientID: keys.id,
    clientSecret: keys.secret,
    callbackURL: CALLBACKHOST + '/auth/github_oauth/callback'
  }, getOrAddUser));

  // GITHUB LOGIN
  app.get('/auth/github_oauth',
    passport.authenticate('github',
      { scope: ['admin:org', 'notifications', 'repo', 'user']
    }));

  app.get('/auth/github_oauth/callback',
    passport.authenticate('github', {
      failureRedirect: '/github/failure'
    }), function(req, res, next) {
      res.redirect('/signin');
    });

  app.get('/github/profile', checkAuth, function(req, res) {
    res.send(req.user);
  });

  app.get('/github/failure', function(req, res) {
    res.send('Authentication failed');
  });

  app.get('/signout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

};

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/github/failure');
  }
};
