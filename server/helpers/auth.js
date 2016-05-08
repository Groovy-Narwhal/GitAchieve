const PORT = require('../config/config-settings').PORT;
const CALLBACKHOST = require('../config/config-settings').CALLBACKHOST;
const request = require('request');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const Strategy = require('passport-github2').Strategy;
const keys = require('./../config/github.config.js');
const session = require('express-session');
const db = require('../db/database.js').db;
const pgp = require('../db/database.js').pgp;

// helper function to be used in Passport authentication as a callback
// adds a user to the database, if they don't already exist
// also updates their repos in our database
const getOrAddUser = function(accessToken, refreshToken, profile, callback) {
  const id = profile._json.id;
  const dbTimestamp = pgp.as.date(new Date());
  const username = profile._json.login;
  const email = profile._json.email;
  const avatar_url = profile._json.avatar_url;
  const followers = profile._json.followers;
  const following = profile._json.following;
  
  
  // add the user to our database, or update them if they already exist
  db.any('INSERT INTO $1~ AS $2~ ($3~, $4~, $5~, $6~, $7~, $8~, $9~) ' +
    'VALUES ($10, $11, $12, $13, $14, $15, $16) ' +
    'ON CONFLICT ($3~) ' +
    'DO UPDATE SET ($4~, $5~, $17~, $7~, $8~, $9~) = ($11, $12, $13, $14, $15, $16) ' +
    'WHERE $2~.$3~ = $10',
    ['users', 'u', 'id', 'username', 'email', 'created_ga', 'avatar_url', 'followers', 'following',
    id, username, email, dbTimestamp, avatar_url, followers, following, 'updated_ga'])
    .then((data) => {
      return callback(null, {data: profile._json, token: accessToken});    
    })
    .catch((error) => {
      console.log('error in user upsert');
      console.error(error);
    });  
      
  // update the user's repos in our database   
  var options = {
    url: CALLBACKHOST + '/api/v1/users/' + id + '/repos',
    method: 'PATCH',
    form: profile,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Authorization': accessToken
    }
  };
  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Success in Auth get repos');
      callback(body);
    }
  });


  // update the user's orgs in our database   
  var options2 = {
    url: CALLBACKHOST + '/api/v1/orgs/' + id + '/orgs',
    method: 'PATCH',
    form: {profile: profile, token: accessToken},
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
  request(options2, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Success in Auth get orgs');
      console.log('body', body)
    }
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
      { scope: [ 'user', 'read:org', 'public_repo' ]
    }));

  app.get('/auth/github_oauth/callback',
    passport.authenticate('github', {
      failureRedirect: '/github/failure'
    }), function(req, res, next) {
      res.redirect('/');
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
