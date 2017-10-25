let express = require('express');
let path = require('path');
//var favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

//The .js files
let index = require('./routes/index');
let stats = require('./routes/stats');
let globalstats = require('./routes/globalstats');
let profilestats = require('./routes/profilestats');
let getData = require('./routes/getData');

let app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cobra');

let db = mongoose.connection;

//Check connection
db.once('open', function () {
    console.log('Connected to MongoDB')
});

//Check for DB errors
db.on('error', function (err) {
    console.log("There's an error with the database. See below for what the error is.");
    console.log(err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', index);
app.use('/', globalstats);
app.use('/', profilestats);
app.use('/', stats);
app.use('/',getData);

//Using express.static middleware to server all public files
//Note: the path that you provide to the express.static f(x) is relative to the directory from where you launch
//your node process. Which is why you used path and dirname
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;

  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//
// //creating a server that browsers can connect to
// app.listen(3000, function () {
//     console.log('listening on 3000')
// });