const PORT = process.env.PORT || 8000;
const callbackHost = (PORT === 8000) ? 'http://127.0.0.1:8000' : 'http://www.gitachieve.com';

const cookieParser = require('cookie-parser');
const passport = require('passport');
const Strategy = require('passport-github2').Strategy;
const keys = require('./../config/github.config.js');
const session = require('express-session');

// TODO: require users from database!

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
    callbackURL: callbackHost + '/auth/github_oauth/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // TODO: Add user to the database!
    return cb(null, profile._json);
  }));

  // GITHUB LOGIN
  app.get('/auth/github_oauth',
    passport.authenticate('github',
      { scope: [ 'user:email' ]
    }));

  app.get('/auth/github_oauth/callback',
    passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/github/failure'
    }));

  app.get('/github/profile', checkAuth, function(req, res) {
    res.send(req.user);
  });

  app.get('/github/failure', function(req, res) {
    res.send('Authentication failed');
  });

  app.get('/signout', function(req, res) {
    req.logout();
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
