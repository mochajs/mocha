'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;
var resolvePath = helpers.resolveFixturePath;

describe('--file', function() {
  var args = [];
  var fixtures = {
    alpha: path.join('options', 'file-alpha'),
    beta: path.join('options', 'file-beta'),
    theta: path.join('options', 'file-theta')
  };

  it('should run tests passed via file first', function(done) {
    args = ['--file', resolvePath(fixtures.alpha)];

    var fixture = fixtures.beta;
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('to have passed test order', 'should be executed first');
      done();
    });
  });

  it('should run multiple tests passed via file first', function(done) {
    args = [
      '--file',
      resolvePath(fixtures.alpha),
      '--file',
      resolvePath(fixtures.beta)
    ];

    var fixture = fixtures.theta;
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 3)
        .and(
          'to have passed test order',
          'should be executed first',
          'should be executed second',
          'should be executed third'
        );
      done();
    });
  });
});
