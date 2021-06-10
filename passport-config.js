const User = require('./models/user');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;  

passport.use('local', new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password'
 },
  function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'User does not exist.' });
      }
      if (!user.isValid(password)) {
        return done(null, false, { message: 'Incorrect password! Please provide a correct one.' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });