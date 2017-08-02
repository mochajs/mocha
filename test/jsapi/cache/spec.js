var path = require('path');
var increment = require('./include');

describe('Mocha', function () {
  it('should increment global counter', function () {
    increment();
  });
});
