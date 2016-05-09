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
  db.any('INSERT INTO users AS u (id, username, email, created_ga, updated_ga, signed_up, avatar_url, followers, following) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
    'ON CONFLICT (id) ' +
    'DO UPDATE SET (username, email, updated_ga, signed_up, avatar_url, followers, following) = ($2, $3, $4, $6, $7, $8, $9) ' +
    'WHERE u.id = $1',
    [id, username, email, dbTimestamp, null, true, avatar_url, followers, following])
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
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };
  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Success in Auth get repos');
      callback(body);
      // update user's pull requests
      var options3 = {
        url: CALLBACKHOST + '/api/v1/orgs/' + id + '/pullrequests',
        method: 'PATCH',
        form: { profile: profile, repos: body, token: accessToken },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': username
        }
      };
      request(options3, (error, response, body) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Success in Auth get pull requests');
          console.log('foo sho', body)
          callback(body);
        }
      });
    }
  });


  // update the user's orgs in our database   
  var options2 = {
    url: CALLBACKHOST + '/api/v1/orgs/' + id + '/orgs',
    method: 'PATCH',
    form: { profile: profile, token: accessToken },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': username
    }
  };
  request(options2, (error, response, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Success in Auth get orgs');
      callback(body);
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
      { scope: ['admin:gpg_key', 'admin:org', 'admin:org_hook', 'admin:public_key', 'admin:repo_hook', 'delete_repo', 'gist', 'notifications', 'repo', 'user']
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
