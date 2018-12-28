'use strict';

var fs = require('fs');

require.extensions['.foo'] = function (module, filename) {
  var content;
  content = fs.readFileSync(filename, 'utf8');
  var test = 'describe("custom compiler",function(){ it("should work",function() { ' +
    'expect(' + content + ', "to be", 1); }); });';
  return module._compile(test, filename);
};
