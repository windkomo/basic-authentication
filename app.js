var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/test", {native_parser:true});

// These are the new imports we're adding:
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var flash = require('connect-flash');

var indexRoutes = require('./routes/index');
var authRoutes = require('./routes/auth');
var userRoutes = require('./routes/users');

var app = express();

app.use(cookieParser());

app.use(expressSession({
    secret:'somesecrettokenhere',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser());

// Here is what we're adding:
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Stuff we're adding:
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  key: 'sid',
  cookie: {secure: false},
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Specify the routes here.
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/user', userRoutes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
