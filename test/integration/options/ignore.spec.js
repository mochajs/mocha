'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;
var resolvePath = helpers.resolveFixturePath;

describe('--ignore', function () {
  /*
   * Runs mocha in {path} with the given args.
   * Calls handleResult with the result.
   *
   * @param {string} fixture
   * @param {string[]} args
   * @param {function} handleResult
   * @param {function} done
   */
  function runMochaTest(fixture, args, handleResult, done) {
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      handleResult(res);
      done();
    });
  }

  it('should ignore specific files', function (done) {
    var fixtures = path.join('options', 'ignore', '*');
    runMochaTest(
      fixtures,
      [
        '--ignore',
        resolvePath(path.join('options', 'ignore', 'fail')).replace(/\\/g, '/')
      ],
      function (res) {
        expect(res, 'to have passed')
          .and('to have run test', 'should find this test')
          .and('not to have pending tests');
      },
      done
    );
  });

  it('should ignore globbed files', function (done) {
    var fixtures = path.join('options', 'ignore', '**', '*');
    runMochaTest(
      fixtures,
      ['--ignore', '**/fail.fixture.js'],
      function (res) {
        expect(res, 'to have passed')
          .and('not to have pending tests')
          .and('to have passed test count', 2);
      },
      done
    );
  });

  it('should ignore multiple patterns', function (done) {
    var fixtures = path.join('options', 'ignore', '**', '*');
    runMochaTest(
      fixtures,
      [
        '--ignore',
        resolvePath(path.join('options', 'ignore', 'fail')).replace(/\\/g, '/'),
        '--ignore',
        resolvePath(path.join('options', 'ignore', 'nested', 'fail')).replace(
          /\\/g,
          '/'
        )
      ],
      function (res) {
        expect(res, 'to have passed')
          .and('not to have pending tests')
          .and('to have passed test count', 2);
      },
      done
    );
  });
});
