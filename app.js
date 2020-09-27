const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const User =  require('./models/user');

const MONGODB_URI = 'mongodb+srv://ksaroz1992:mongodb7029@cluster0-13s3r.mongodb.net/sajha?retryWrites=true&w=majority';

var app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' 
});
const csrfProtection = csrf();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const adminRouter = require('./routes/admin');
const productsRouter = require('./routes/shop');
const accountRouter = require('./routes/account');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/owl.carousel/dist')); // redirect JS OwlCarousel
app.use('/js', express.static(__dirname + '/node_modules/jquery-mousewheel')); // jquery mousewheel
app.use('/css', express.static(__dirname + '/node_modules/owl.carousel/dist/assets')); // redirect OwlCarousel Css
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(
  session({ 
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store 
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRouter);
app.use('/', productsRouter);
app.use('/', accountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.connect(process.env.MONGO_URL || MONGODB_URI,
{ useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
     console.log('connected');
  })
  .catch(err => {
    console.log(err);
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
