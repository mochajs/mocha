'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--repeats', function () {
  var args = [];

  it('should repeat tests', function (done) {
    args = ['--repeats', '3'];
    var fixture = path.join('options', 'repeats');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('not to have pending tests')
        .and('to have repeated test', 'should pass', 3);
      done();
    });
  });
});
