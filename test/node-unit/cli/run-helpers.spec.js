'use strict';

const {validateLegacyPlugin, list} = require('../../../lib/cli/run-helpers');

describe('helpers', function() {
  describe('validateLegacyPlugin()', function() {
    describe('when used with "reporter" key', function() {
      it('should disallow an array of names', function() {
        expect(
          () => validateLegacyPlugin({reporter: ['bar']}, 'reporter'),
          'to throw',
          {
            code: 'ERR_MOCHA_INVALID_REPORTER',
            message: /can only be specified once/i
          }
        );
      });

      it('should fail to recognize an unknown reporter', function() {
        expect(
          () => validateLegacyPlugin({reporter: 'bar'}, 'reporter'),
          'to throw',
          {code: 'ERR_MOCHA_INVALID_REPORTER', message: /cannot find module/i}
        );
      });
    });

    describe('when used with an "interfaces" key', function() {
      it('should disallow an array of names', function() {
        expect(
          () => validateLegacyPlugin({interface: ['bar']}, 'interface'),
          'to throw',
          {
            code: 'ERR_MOCHA_INVALID_INTERFACE',
            message: /can only be specified once/i
          }
        );
      });

      it('should fail to recognize an unknown interface', function() {
        expect(
          () => validateLegacyPlugin({interface: 'bar'}, 'interface'),
          'to throw',
          {code: 'ERR_MOCHA_INVALID_INTERFACE', message: /cannot find module/i}
        );
      });
    });

    describe('when used with an unknown plugin type', function() {
      it('should fail', function() {
        expect(
          () => validateLegacyPlugin({frog: 'bar'}, 'frog'),
          'to throw',
          /unknown plugin/i
        );
      });
    });

    describe('when a plugin throws an exception upon load', function() {
      it('should fail and report the original error', function() {
        expect(
          () =>
            validateLegacyPlugin(
              {
                reporter: require.resolve('./fixtures/bad-module.fixture.js')
              },
              'reporter'
            ),
          'to throw',
          {message: /wonky/, code: 'ERR_MOCHA_INVALID_REPORTER'}
        );
      });
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
