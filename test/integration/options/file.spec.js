'use strict';

var path = require('path').posix;
const {
  runMochaJSON,
  resolveFixturePath: resolvePath,
  runMocha
} = require('../helpers');

describe('--file', function () {
  var args = [];
  var fixtures = {
    alpha: path.join('options', 'file-alpha'),
    beta: path.join('options', 'file-beta'),
    theta: path.join('options', 'file-theta')
  };

  it('should run tests passed via file first', function (done) {
    args = ['--file', resolvePath(fixtures.alpha)];

    var fixture = fixtures.beta;
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('to have passed test order', 'should be executed first');
      done();
    });
  });

  it('should run multiple tests passed via file first', function (done) {
    args = [
      '--file',
      resolvePath(fixtures.alpha),
      '--file',
      resolvePath(fixtures.beta)
    ];

    var fixture = fixtures.theta;
    runMochaJSON(fixture, args, function (err, res) {
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

  it('should support having no other test files', function (done) {
    args = ['--file', resolvePath(fixtures.alpha)];

    runMochaJSON('filethatdoesnotexist.js', args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed').and('to have passed test count', 1);
      done();
    });
  });

  it('should log a warning if a nonexistent file is specified', function (done) {
    runMocha(
      'esm/type-module/test-that-imports-non-existing-module.fixture.js',
      ['--file'],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res.output, 'to contain', 'Warning: Cannot find test file').and(
          'to contain',
          'test-that-imports-non-existing-module'
        );
        done();
      },
      {stdio: 'pipe'}
    );
  });
});
