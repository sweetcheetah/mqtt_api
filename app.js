var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

var app = express();
var cors = require('cors')

var current_value = {}
var last_update = {}
// TODO multiple topic support 
// { topic1: { last_update: "date string", current_value: "some string" },
// topic2: {} }


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

var mqtt_client = require('./data/mqtt-topics')
mqtt_client.on('message', function (topic, message) {
  let date_ob = new Date()
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2)
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
  let year = date_ob.getFullYear()
  let hours = date_ob.getHours()
  let minutes = date_ob.getMinutes()
  let seconds = date_ob.getSeconds()
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  let date_string = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds

  if ( message.toString() !== current_value ) {
    const re = /\//gi;
    const topic_with_subs = topic.replace(re, '-')
    console.log("%s;%s;%s", date_string, topic_with_subs, message.toString());
    current_value[topic_with_subs] = message.toString();
    last_update[topic_with_subs] = date_string;
  }
}) 

app.get('/topic/:topicname/current', (req,res) => {
  res.json({
    topic: req.params.topicname,
    value: current_value[req.params.topicname],
    lastUpdated: last_update[req.params.topicname]
  })
});

app.get('/topic/:topicname/past/:unit/:quantity', (req,res) => {
  res.send("topic past")
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
