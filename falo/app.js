var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


// mongoose
var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://often127:D3c0DeD.doc@often127.3eupw.mongodb.net/final?retryWrites=true&w=majority')
  .then(() => console.log('mongodb connected'))  
  .catch( error => handleError(error))


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 60000 }
}));

function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);
	if (req.url === '/home' && (!req.session || !req.session.authenticated)) {
		res.render('account/login', { status: 403 });
		return;
	}
	next();
}
app.use(checkAuth);

// router
require('./routes/index')(app);


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