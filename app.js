const createError = require('http-errors');
const express = require('express');
const cors = require('cors'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const User =  require('./models/user');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
//const csrf = require('csurf');
//const flash = require('connect-flash');

//const MONGODB_URI = 'mongodb+srv://ksaroz1992:mongodb7029@cluster0-13s3r.mongodb.net/sajha?retryWrites=true&w=majority';
//const MONGODB_URI = 'mongodb+srv://Kshresthasan:166ssb7029@cluster0.ikbtv.mongodb.net/Sajhakart?retryWrites=true&w=majority';
const MONGODB_URI = 'mongodb://localhost:27017/sajhakart';

var app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' 
});
app.use(cors({
  origin:['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));
//const csrfProtection = csrf();
//view engine setup;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const adminRouter = require('./routes/admin');
const productsRouter = require('./routes/shop');
const userRouter = require('./routes/user');
// const categoryRouter = require('./routes/category');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(__dirname + 'public/images'));
// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
// app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
// app.use('/js', express.static(__dirname + '/node_modules/owl.carousel/dist')); // redirect JS OwlCarousel
// app.use('/js', express.static(__dirname + '/node_modules/jquery-mousewheel')); // jquery mousewheel
// app.use('/css', express.static(__dirname + '/node_modules/owl.carousel/dist/assets')); // redirect OwlCarousel Css
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(
  session({
    name: 'myname.sid',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 36000000,
      httpOnly: false,
      secure: false
    }
  })
  );
require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(req.user);
//   next();
// })

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// })
// app.use(csrfProtection);
// app.use(flash());

app.use((req, res, next) => {
  //console.log(req.user);  //getting user.
  if (!req.user) {
    return next();
  }
  User.findById(req.user)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use('/api/admin', adminRouter);
app.use('/api/', productsRouter);
app.use('/api/user', userRouter);
// app.use('/api/category', categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.connect(process.env.MONGO_URL || MONGODB_URI,
{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
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
  res.render('error');
  res.status(err.status || 500);
});

module.exports = app;
