'use strict';
var helpers = require('./helpers');
var run = helpers.runMochaJSON;
var runMochaAsync = helpers.runMochaAsync;
var utils = require('../../lib/utils');
var args =
  +process.versions.node.split('.')[0] >= 13 ? [] : ['--experimental-modules'];

describe('esm', function() {
  before(function() {
    if (!utils.supportsEsModules(true)) this.skip();
  });

  it('should pass a passing esm test that uses esm', function(done) {
    var fixture = 'esm/esm-success.fixture.mjs';
    run(fixture, args, function(err, result) {
      if (err) {
        done(err);
        return;
      }

      expect(result, 'to have passed test count', 1);
      done();
    });
  });

  it('should fail a failing esm test that uses esm', function(done) {
    var fixture = 'esm/esm-failure.fixture.mjs';
    run(fixture, args, function(err, result) {
      if (err) {
        done(err);
        return;
      }

      expect(result, 'to have failed test count', 1).and(
        'to have failed test',
        'should use a function from an esm, and fail'
      );
      done();
    });
  });

  it('should show file location when there is a syntax error in the test', async function() {
    var fixture = 'esm/syntax-error/esm-syntax-error.fixture.mjs';
    const err = await runMochaAsync(fixture, args, {stdio: 'pipe'}).catch(
      err => err
    );
    expect(err.output, 'to contain', 'SyntaxError').and(
      'to contain',
      'esm-syntax-error.fixture.mjs'
    );
  });

  it('should recognize esm files ending with .js due to package.json type flag', function(done) {
    if (!utils.supportsEsModules(false)) return this.skip();

    var fixture = 'esm/js-folder/esm-in-js.fixture.js';
    run(fixture, args, function(err, result) {
      if (err) {
        done(err);
        return;
      }

      expect(result, 'to have passed test count', 1);
      done();
    });
  });
});
