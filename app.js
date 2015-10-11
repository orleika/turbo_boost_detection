'use strict';

/* jshint unused: false */

const express = require('express'),
  app = express(),
  fs = require('fs'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  cors = require('cors'),
  mongoose = require('mongoose');

// Use helmet to secure Express headers
app.use(helmet());
app.use(cors({
  origin: process.env.HOST || 'localhost',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());

const connect = () => {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };
  mongoose.connect(process.env.MONGODB_URI, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('connected', console.log);
// mongoose.connection.on('disconnected', connect);
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});
fs.readdirSync(`${__dirname}/models`).forEach((file) => {
  if (file.includes('.js')) {
    require(`${__dirname}/models/${file}`);
  }
});

app.use(require('./router'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

module.exports = app;
