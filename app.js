var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

var app = express();
var cors = require('cors')

var current_value = {};
var last_update = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

var mqtt_client = require('./data/mqtt-topics');
mqtt_client.on('message', function (topic, message) {
  const date = new Date().getTime();

  if ( message.toString() !== current_value ) {
    const re = /\//gi;
    const topic_with_subs = topic.replace(re, '-');
    console.log("%s;%s;%s", date, topic_with_subs, message.toString());
    current_value[topic_with_subs] = message.toString();
    last_update[topic_with_subs] = `${date}`;
  }
});

app.get('/topic/:topicname/current', (req,res) => {
  res.json({
    topic: req.params.topicname,
    value: current_value[req.params.topicname],
    lastUpdated: last_update[req.params.topicname]
  });
});

app.get('/topic/:topicname/past/:unit/:quantity', (req,res) => {
  res.send("topic past");
});

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
