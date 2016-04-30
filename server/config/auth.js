var PORT = process.env.PORT || 8080;

var cookieparser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-github2').Strategy;
var keys = require('./github.config.js');
var app 

// require users from database

module.exports = function(app) {
  app.use(cookieparser());
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
  
  var callbackHost = (PORT === 8000) ? 'http://localhost:8000' ? 'http://www.gitachieve.com';
  passport.use(new Strategy({
    clientId: keys.id,
    clientSecret: keys.secret,
    callbackURL: callbackHost + '/login/github_callback'
  }, function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));
};


// GITHUB LOGIN
  app.get('/login/github',
    passport.authenticate('github', {scope: ['user:email','read:org', 'public_repo']}));

  app.get('/login/github_callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
      // Successful authentication, create cookie, redirect home.
      res.cookie('githubId', req.user.id);
      res.cookie('githubName', req.user.login);
      res.redirect('/');
    });

  function checkPermission (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/github/failure');
    }
  }

  app.get('/github/profile', checkPermission, function (req, res) {
    res.send(req.user);
  });

  app.get('/github/failure', function (req, res) {
    res.send("Authentication failed.");
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};


