var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const mongoose = require('mongoose');
var config = require('./config');


var app = express();
mongoose.connect(config.database, {useNewUrlParser: true})
    .then(result => {
        console.log('database connected');

    })
    .catch(err => {
        console.log(err);
        console.log('check your database connectivity')
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
