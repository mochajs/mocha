
/**
 * Module dependencies.
 */

var fs = require('fs')
  , debug = require('debug')('watch');

module.exports = function(paths, fn){
  var options = { interval: 100 };
  paths.forEach(function(path){
    debug('watch %s', path);
    fs.watchFile(path, options, function(curr, prev){
      if (prev.mtime < curr.mtime) fn(path);
    });
  });
};