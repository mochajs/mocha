'use strict';
var run = require('./helpers').runMochaJSON;
var utils = require('../../lib/utils');

if (!utils.supportsEsModules()) return;

describe('esm', function() {
  it('should pass a passing esm test that uses esm', function(done) {
    run(
      'esm/esm-success.fixture.mjs',
      utils.supportsEsModules(true)
        ? []
        : ['--experimental-modules', '--no-warnings'],
      function(err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(result, 'to have passed test count', 1);
        done();
      },
      'pipe'
    );
  });

  it('should fail a failing esm test that uses esm', function(done) {
    run(
      'esm/esm-failure.fixture.mjs',
      ['--experimental-modules', '--no-warnings'],
      function(err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(result, 'to have failed test count', 1);
        done();
      }
    );
  });

  it('should recognize esm files ending with .js due to package.json type flag', function(done) {
    run(
      'esm/js-folder/esm-in-js.fixture.js',
      ['--experimental-modules', '--no-warnings'],
      function(err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(result, 'to have passed test count', 1);
        done();
      },
      'pipe'
    );
  });
});
