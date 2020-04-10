'use strict';

const {
  validatePlugin,
  list,
  loadRootHooks
} = require('../../../lib/cli/run-helpers');
const {createSandbox} = require('sinon');

describe('run helper functions', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('loadRootHooks()', function() {
    describe('when passed nothing', function() {
      it('should reject', async function() {
        return expect(loadRootHooks(), 'to be rejected');
      });
    });

    describe('when passed empty array of hooks', function() {
      it('should return an empty MochaRootHooks object', async function() {
        return expect(loadRootHooks([]), 'to be fulfilled with', {
          beforeAll: [],
          beforeEach: [],
          afterAll: [],
          afterEach: []
        });
      });
    });

    describe('when passed an array containing hook objects and sync functions and async functions', function() {
      it('should flatten them into a single object', async function() {
        function a() {}
        function b() {}
        function d() {}
        function g() {}
        function f() {}
        function c() {
          return {
            beforeAll: d,
            beforeEach: g
          };
        }
        async function e() {
          return {
            afterEach: f
          };
        }
        return expect(
          loadRootHooks([
            {
              beforeEach: a
            },
            {
              afterAll: b
            },
            c,
            e
          ]),
          'to be fulfilled with',
          {
            beforeAll: [d],
            beforeEach: [a, g],
            afterAll: [b],
            afterEach: [f]
          }
        );
      });
    });
  });

  describe('validatePlugin()', function() {
    it('should disallow an array of module names', function() {
      expect(
        () => validatePlugin({foo: ['bar']}, 'foo'),
        'to throw a',
        TypeError
      );
    });
  });

  describe('list()', function() {
    describe('when provided a flat array', function() {
      it('should return a flat array', function() {
        expect(list(['foo', 'bar']), 'to equal', ['foo', 'bar']);
      });
    });
    describe('when provided a nested array', function() {
      it('should return a flat array', function() {
        expect(list([['foo', 'bar'], 'baz']), 'to equal', [
          'foo',
          'bar',
          'baz'
        ]);
      });
    });
    describe('when given a comma-delimited string', function() {
      it('should return a flat array', function() {
        expect(list('foo,bar'), 'to equal', ['foo', 'bar']);
      });
    });
  });
});
