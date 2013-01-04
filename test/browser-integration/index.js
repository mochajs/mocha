
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.enable('strict routing');

// load examples


/**
 * GET JS files
 */

app.get('/mocha.js', function(req, res){
  res.sendfile(join(__dirname, '../../mocha.js'));
});
app.get('/mocha.css', function(req, res){
  res.sendfile(join(__dirname, '../../mocha.css'));
});

/**
 * GET /* as a file if it exists.
 */

app.get('/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var path = join(__dirname,file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendfile(path);
  });
});

/**
 * GET sample app
 */

app.get('/*', function(req, res){
  res.sendfile(join(__dirname, 'app', 'index.html'));
});

app.listen(3333);
console.log('Example server listening on port 3333');
