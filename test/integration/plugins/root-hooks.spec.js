'use strict';

var invokeMochaAsync = require('../helpers').invokeMochaAsync;
var utils = require('../../../lib/utils');

/**
 * Extracts root hook log messages from run results
 * `root-hook-defs-*` fixtures are root hook plugins which call `console.log()`
 * for verification that they have been run.
 * @param {RawResult} res - result of invokeMochaAsync()
 */
function extractHookOutputFromResult(res) {
  return res.output
    .trim()
    .split('\n')
    .filter(function(line) {
      // every line that begins with whitespace (e.g., the test name) should be ignored;
      // we just want the console.log messages
      return /^\S/.test(line);
    })
    .sort();
}

/**
 * Helper to call Mocha and pipe the result through `extractHookOutputFromResult`
 * @param {*} args - args for invokeMochaAsync
 * @param {*} opts - opts for invokeMochaAsync
 */
function runMochaForHookOutput(args, opts) {
  return invokeMochaAsync(args, opts)[1].then(extractHookOutputFromResult);
}

describe('root hooks', function() {
  describe('when mocha run in serial mode', function() {
    it('should run root hooks when provided via mochaHooks object export', function() {
      return expect(
        runMochaForHookOutput([
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js'
            ),
          require.resolve(
            '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
          )
        ]),
        'to be fulfilled with',
        [
          'afterAll',
          'afterAll array 1',
          'afterAll array 2',
          'afterEach',
          'afterEach array 1',
          'afterEach array 2',
          'beforeAll',
          'beforeAll array 1',
          'beforeAll array 2',
          'beforeEach',
          'beforeEach array 1',
          'beforeEach array 2'
        ]
      );
    });

    it('should run root hooks when provided via mochaHooks function export', function() {
      return expect(
        runMochaForHookOutput([
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-c.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-d.fixture.js'
            ),
          require.resolve(
            '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
          )
        ]),
        'to be fulfilled with',
        [
          'afterAll',
          'afterAll array 1',
          'afterAll array 2',
          'afterEach',
          'afterEach array 1',
          'afterEach array 2',
          'beforeAll',
          'beforeAll array 1',
          'beforeAll array 2',
          'beforeEach',
          'beforeEach array 1',
          'beforeEach array 2'
        ]
      );
    });

    describe('support ESM when type=module or .mjs extension', function() {
      before(function() {
        if (!utils.supportsEsModules()) this.skip();
      });

      it('should run root hooks when provided via mochaHooks', function() {
        return expect(
          runMochaForHookOutput(
            [
              '--require=' +
                require.resolve(
                  // as object
                  '../fixtures/plugins/root-hooks/root-hook-defs-esm.fixture.mjs'
                ),
              '--require=' +
                require.resolve(
                  // as function
                  '../fixtures/plugins/root-hooks/esm/root-hook-defs-esm.fixture.js'
                ),
              '--require=' +
                require.resolve(
                  // mixed with commonjs
                  '../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js'
                ),
              require.resolve(
                '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
              )
            ].concat(
              +process.versions.node.split('.')[0] >= 13
                ? []
                : '--experimental-modules'
            )
          ),
          'to be fulfilled with',
          [
            'afterAll',
            'afterEach',
            'beforeAll',
            'beforeEach',
            'esm afterEach',
            'esm beforeEach',
            'mjs afterAll',
            'mjs beforeAll'
          ]
        );
      });
    });

    describe('support ESM via .js extension w/o type=module', function() {
      before(function() {
        if (!utils.supportsEsModules()) this.skip();
      });

      it('should fail due to ambiguous file type', function() {
        return expect(
          invokeMochaAsync(
            [
              '--require=' +
                require.resolve(
                  // as object
                  '../fixtures/plugins/root-hooks/root-hook-defs-esm-broken.fixture.js'
                )
            ].concat(
              +process.versions.node.split('.')[0] >= 13
                ? []
                : '--experimental-modules'
            ),
            'pipe'
          )[1],
          'when fulfilled',
          'to contain output',
          /SyntaxError: Unexpected token/
        );
      });
    });
  });

  describe('when mocha in parallel mode', function() {
    it('should run root hooks when provided via mochaHooks object exports', function() {
      return expect(
        runMochaForHookOutput([
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js'
            ),
          '--parallel',
          require.resolve(
            '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
          )
        ]),
        'to be fulfilled with',
        [
          'afterAll',
          'afterAll array 1',
          'afterAll array 2',
          'afterEach',
          'afterEach array 1',
          'afterEach array 2',
          'beforeAll',
          'beforeAll array 1',
          'beforeAll array 2',
          'beforeEach',
          'beforeEach array 1',
          'beforeEach array 2'
        ]
      );
    });

    it('should run root hooks when provided via mochaHooks function export', function() {
      return expect(
        runMochaForHookOutput([
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-c.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-defs-d.fixture.js'
            ),
          '--parallel',
          require.resolve(
            '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
          )
        ]),
        'to be fulfilled with',
        [
          'afterAll',
          'afterAll array 1',
          'afterAll array 2',
          'afterEach',
          'afterEach array 1',
          'afterEach array 2',
          'beforeAll',
          'beforeAll array 1',
          'beforeAll array 2',
          'beforeEach',
          'beforeEach array 1',
          'beforeEach array 2'
        ]
      );
    });

    describe('when running multiple jobs', function() {
      it('should run root hooks when provided via mochaHooks object exports for each job', function() {
        return expect(
          runMochaForHookOutput([
            '--require=' +
              require.resolve(
                '../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js'
              ),
            '--require=' +
              require.resolve(
                '../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js'
              ),
            '--parallel',
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-test.fixture.js'
            ),
            require.resolve(
              '../fixtures/plugins/root-hooks/root-hook-test-2.fixture.js'
            )
          ]),
          'to be fulfilled with',
          [
            'afterAll',
            'afterAll',
            'afterAll array 1',
            'afterAll array 1',
            'afterAll array 2',
            'afterAll array 2',
            'afterEach',
            'afterEach',
            'afterEach array 1',
            'afterEach array 1',
            'afterEach array 2',
            'afterEach array 2',
            'beforeAll',
            'beforeAll',
            'beforeAll array 1',
            'beforeAll array 1',
            'beforeAll array 2',
            'beforeAll array 2',
            'beforeEach',
            'beforeEach',
            'beforeEach array 1',
            'beforeEach array 1',
            'beforeEach array 2',
            'beforeEach array 2'
          ]
        );
      });
    });
  });
});
