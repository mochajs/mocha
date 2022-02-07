'use strict';

require('invalidImport.js');
// a comment
module.exports = {
  require: ['foo', 'bar'],
  bail: true,
  reporter: 'dot',
  slow: 60
};
