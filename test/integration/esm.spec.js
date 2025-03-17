'use strict';
var path = require('node:path');
const {runMochaJSON: run, runMochaAsync} = require('./helpers');
var args = [];

describe('esm', function () {
  it('should pass a passing esm test that uses esm', function (done) {
    var fixture = 'esm/esm-success.fixture.mjs';
    run(fixture, args, function (err, result) {
      if (err) {
        done(err);
        return;
      }

      expect(result, 'to have passed test count', 1);
      done();
    });
  });

  it('should fail a failing esm test that uses esm', function (done) {
    var fixture = 'esm/esm-failure.fixture.mjs';
    run(fixture, args, function (err, result) {
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

  it('should show file location when there is a syntax error in the test', async function () {
    var fixture = 'esm/syntax-error/esm-syntax-error.fixture.mjs';
    const err = await runMochaAsync(fixture, args, {stdio: 'pipe'}).catch(
      err => err
    );
    expect(err.output, 'to contain', 'SyntaxError').and(
      'to contain',
      'esm-syntax-error.fixture.mjs'
    );
  });

  it('should recognize esm files ending with .js due to package.json type flag', function (done) {
    var fixture = 'esm/js-folder/esm-in-js.fixture.js';
    run(fixture, args, function (err, result) {
      if (err) {
        done(err);
        return;
      }

      expect(result, 'to have passed test count', 1);
      done();
    });
  });

  it('should enable requiring/loading a cjs module with "dir" as filename', async function () {
    var fixture = 'esm/test-that-uses-dir-cjs-require.fixture.js';
    const result = await runMochaAsync(
      fixture,
      ['--require', path.resolve(__dirname, './fixtures/esm/dir-cjs-require')],
      {stdio: 'pipe'}
    );

    expect(result, 'to have passed test count', 1);
  });

  it('should throw an ERR_MODULE_NOT_FOUND and not ERR_REQUIRE_ESM if file imports a non-existing module', async function () {
    const fixture =
      'esm/type-module/test-that-imports-non-existing-module.fixture.js';

    const err = await runMochaAsync(fixture, ['--unhandled-rejections=warn'], {
      stdio: 'pipe'
    }).catch(err => err);

    expect(err.output, 'to contain', 'ERR_MODULE_NOT_FOUND').and(
      'to contain',
      'test-that-imports-non-existing-module'
    );
  });

  it('should throw an ERR_MODULE_NOT_FOUND and not ERR_REQUIRE_ESM if file imports a non-existing module with a loader', async function () {
    const fixture =
      'esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts';

    const err = await runMochaAsync(
      fixture,
      [
        '--unhandled-rejections=warn',
        '--loader=./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs'
      ],
      {
        stdio: 'pipe'
      }
    ).catch(err => err);

    expect(err.output, 'to contain', 'ERR_MODULE_NOT_FOUND').and(
      'to contain',
      'non-existent-package'
    );
  });
});
