'use strict';

var invokeMochaAsync = require('../helpers').invokeMochaAsync;
var utils = require('../../../lib/utils');

describe('--require', function() {
  describe('when mocha run in serial mode', function() {
    it('should run root hooks when provided via mochaHooks object export', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-b.fixture.js'
            ),
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll[\s\S]+?beforeAll array 1[\s\S]+?beforeAll array 2[\s\S]+?beforeEach[\s\S]+?beforeEach array 1[\s\S]+?beforeEach array 2[\s\S]+?afterEach[\s\S]+?afterEach array 1[\s\S]+?afterEach array 2[\s\S]+?afterAll[\s\S]+?afterAll array 1[\s\S]+?afterAll array 2/
      );
    });

    it('should run root hooks when provided via mochaHooks function export', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-c.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-d.fixture.js'
            ),
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll[\s\S]+?beforeAll array 1[\s\S]+?beforeAll array 2[\s\S]+?beforeEach[\s\S]+?beforeEach array 1[\s\S]+?beforeEach array 2[\s\S]+?afterEach[\s\S]+?afterEach array 1[\s\S]+?afterEach array 2[\s\S]+?afterAll[\s\S]+?afterAll array 1[\s\S]+?afterAll array 2/
      );
    });

    describe('support ESM when style=module or .mjs extension', function() {
      before(function() {
        if (!utils.supportsEsModules()) this.skip();
      });

      it('should run root hooks when provided via mochaHooks', function() {
        return expect(
          invokeMochaAsync(
            [
              '--require=' +
                require.resolve(
                  // as object
                  '../fixtures/options/require/root-hook-defs-esm.fixture.mjs'
                ),
              '--require=' +
                require.resolve(
                  // as function
                  '../fixtures/options/require/esm/root-hook-defs-esm.fixture.js'
                ),
              '--require=' +
                require.resolve(
                  // mixed with commonjs
                  '../fixtures/options/require/root-hook-defs-a.fixture.js'
                ),
              require.resolve(
                '../fixtures/options/require/root-hook-test.fixture.js'
              )
            ].concat(
              +process.versions.node.split('.')[0] >= 13
                ? []
                : '--experimental-modules'
            )
          )[1],
          'when fulfilled',
          'to contain output',
          /mjs beforeAll[\s\S]+?beforeAll[\s\S]+?esm beforeEach[\s\S]+?beforeEach[\s\S]+?esm afterEach[\s\S]+?afterEach[\s\S]+?mjs afterAll[\s\S]+?afterAll/
        );
      });
    });
  });

  describe('when mocha in parallel mode', function() {
    before(function() {
      this.skip(); // TODO: remove when #4245 lands
    });
    it('should run root hooks when provided via mochaHooks object exports', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-b.fixture.js'
            ),
          '--parallel',
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll[\s\S]+?beforeAll array 1[\s\S]+?beforeAll array 2[\s\S]+?beforeEach[\s\S]+?beforeEach array 1[\s\S]+?beforeEach array 2[\s\S]+?afterEach[\s\S]+?afterEach array 1[\s\S]+?afterEach array 2[\s\S]+?afterAll[\s\S]+?afterAll array 1[\s\S]+?afterAll array 2/
      );
    });

    it('should run root hooks when provided via mochaHooks function export', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-c.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-d.fixture.js'
            ),
          '--parallel',
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll[\s\S]+?beforeAll array 1[\s\S]+?beforeAll array 2[\s\S]+?beforeEach[\s\S]+?beforeEach array 1[\s\S]+?beforeEach array 2[\s\S]+?afterEach[\s\S]+?afterEach array 1[\s\S]+?afterEach array 2[\s\S]+?afterAll[\s\S]+?afterAll array 1[\s\S]+?afterAll array 2/
      );
    });

    describe('when running multiple jobs', function() {
      it('should run root hooks when provided via mochaHooks object exports for each job', function() {
        return expect(
          invokeMochaAsync([
            '--require=' +
              require.resolve(
                '../fixtures/options/require/root-hook-defs-a.fixture.js'
              ),
            '--require=' +
              require.resolve(
                '../fixtures/options/require/root-hook-defs-b.fixture.js'
              ),
            '--parallel',
            require.resolve(
              '../fixtures/options/require/root-hook-test.fixture.js'
            ),
            require.resolve(
              '../fixtures/options/require/root-hook-test-2.fixture.js'
            )
          ])[1],
          'when fulfilled',
          'to contain output',
          /(?:beforeAll[\s\S]+?beforeAll array 1[\s\S]+?beforeAll array 2[\s\S]+?beforeEach[\s\S]+?beforeEach array 1[\s\S]+?beforeEach array 2[\s\S]+?afterEach[\s\S]+?afterEach array 1[\s\S]+?afterEach array 2[\s\S]+?afterAll[\s\S]+?afterAll array 1[\s\S]+?afterAll array 2[\s\S]+?){2}/
        );
      });
    });
  });
});
