var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require('dotenv');

const connect = require('./database/connectDatabase');

var indexRouter = require('./routes/index');
var membersRouter = require('./routes/members');
var auth = require('./routes/auth');
var member = require('./routes/members');
var board = require('./routes/board');
var list = require('./routes/list');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




dotenv.config();
//connect databse

connect();

app.use(cors());
app.use('/', indexRouter);
app.use('/api/members', membersRouter);
app.use('/api/auth', auth);
app.use('/api/member', member);
app.use('/api/board', board);
app.use('/api/list', list);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
