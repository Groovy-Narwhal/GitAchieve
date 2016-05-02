const PORT = process.env.PORT || 8080;

const cookieparser = require('cookie-parser');
const passport = require('passport');
const Strategy = require('passport-github2').Strategy;
const keys = require('./../config/github.config.js');
const session = require('express-session');

// TODO: require users from database!

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
  
  var callbackHost = (PORT === 8000) ? 'http://localhost:8000' : 'http://www.gitachieve.com';

  passport.use(new Strategy({
    clientID: keys.id,
    clientSecret: keys.secret,
    callbackURL: callbackHost + '/signin/github/callback'
  },
    function(accessToken, refreshToken, profile, cb) {
      process.nextTick(function() {
        console.log('This is your Token: ', accessToken);
        // TODO: Add user to the database!
        return cb(null, profile);
      });
    }
  ));

  // GITHUB LOGIN
  app.get('/signin/github',
    passport.authenticate('github', {scope: ['user:email']}),
      function(req, res) {
      // The request will be redirected to GitHub for authentication so this function will not be called
    }
  );

  app.get('/signin/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
      res.cookie('githubId', req.user.id);
      res.cookie('githubName', req.user.login);
      res.redirect('/');
    }
  );

  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/github/profile', checkAuth, function(req, res) {
    res.send(req.user);
  });

  app.get('/github/failure', function(req, res) {
    res.send('Authentication failed');
  });

};

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/github/failure');
  }
};


