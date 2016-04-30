var PORT = process.env.PORT || 8080;

var cookieparser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-github2').Strategy;
var keys = require('./github.config.js');

passport.use(new Strategy({
  clientId: keys.id,
  clientSecret: keys.secret,
  callbackURL: 'http://localhost:3000/login/github/return'
}, function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});