'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--allow-uncaught', function() {
  var args = ['--allow-uncaught'];

  it('should run with conditional `this.skip()`', function(done) {
    var fixture = path.join('options', 'allow-uncaught', 'this-skip-it');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('to have pending test count', 3)
        .and('to have passed test', 'test1', 'test4')
        .and('to have pending test order', 'test2', 'test3', 'test5');
      done();
    });
  });
});
