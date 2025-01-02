'use strict';

var path = require('node:path').posix;
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

  it('should run esm tests passed via file', function (done) {
    const esmFile = 'collect-files.fixture.mjs';
    const testArgs = ['--file', resolvePath(esmFile)];

    runMochaJSON(esmFile, testArgs, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });

  it('should log a warning if a nonexistent file with an unknown extension is specified', function (done) {
    const nonexistentTestFileArg = 'nonexistent.test.ts';
    runMocha(
      nonexistentTestFileArg,
      ['--file'],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(
          res.output,
          'to contain',
          `Warning: Cannot find any files matching pattern`
        ).and('to contain', nonexistentTestFileArg);
        done();
      },
      {stdio: 'pipe'}
    );
  });

  it('should provide warning for nonexistent js file extensions', function (done) {
    const nonexistentCjsArg = 'nonexistent.test.js';

    runMocha(
      nonexistentCjsArg,
      ['--file'],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(
          res.output,
          'to contain',
          `Warning: Cannot find any files matching pattern`
        ).and('to contain', nonexistentCjsArg);
        done();
      },
      {stdio: 'pipe'}
    );
  });

  it('should provide warning for nonexistent esm file extensions', function (done) {
    const nonexistentEsmArg = 'nonexistent.test.mjs';

    runMocha(
      nonexistentEsmArg,
      ['--file'],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(
          res.output,
          'to contain',
          `Warning: Cannot find any files matching pattern`
        ).and('to contain', nonexistentEsmArg);
        done();
      },
      {stdio: 'pipe'}
    );
  });
});
