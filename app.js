var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.get('/contactlist', function(req, res){
  console.log('I received a GET request.');

  db.contactlist.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });    
});

app.post('/contactlist', function(req, res){
  console.log(req.body);
  db.contactlist.insert(req.body, function(err,docs){
    res.json(docs);
  });
});

app.delete('/contactlist/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err,docs){
    res.json(docs);
  });
});

app.get('/contactlist/:id', function(req,res){
  var id = req.params.id;
  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err,docs){
    res.json(docs);
  });
});

app.put('/contactlist/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
      new: true}, function(err, docs){
        res.json(docs);
      });
});

app.listen(7000);

console.log('Server is running on port 7000');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
