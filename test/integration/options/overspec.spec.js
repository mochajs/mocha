'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--overspec', function() {
  it('should fail over specs', function(done) {
    var args = [];
    var fixture = path.join('options', 'overspec');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have failed');
      done();
    });
  });

  it('should not fail over spec', function(done) {
    var args = ['--overspec'];
    var fixture = path.join('options', 'overspec');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });
});
