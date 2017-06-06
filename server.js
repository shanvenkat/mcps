var bodyParser = require('body-parser');
var compass = require('compass');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');

// compass css preprocessing in the public directory 
compass.compile({ cwd: __dirname + '\\public\\stylesheets' }, function(err, stdout, stderr) {
  console.log('Compass done.');
});

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
