'use strict';

const {validatePlugin, list} = require('../../../lib/cli/run-helpers');
const {createSandbox} = require('sinon');

describe('cli "run" command', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('helpers', function() {
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
});
