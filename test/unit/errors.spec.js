'use strict';

var errors = require('../../lib/errors');

describe('Errors', function() {
  var message = 'some message';

  describe('createInvalidReporterError()', function() {
    it('should include expected code in thrown reporter errors', function() {
      expect(
        errors.createInvalidReporterError(message, 'badReporter'),
        'to satisfy',
        {
          message: message,
          code: 'ERR_MOCHA_INVALID_REPORTER',
          reporter: 'badReporter'
        }
      );
    });
  });

  describe('createInvalidInterfaceError()', function() {
    it('should include expected code in thrown interface errors', function() {
      expect(
        errors.createInvalidInterfaceError(message, 'badUi'),
        'to satisfy',
        {
          message: message,
          code: 'ERR_MOCHA_INVALID_INTERFACE',
          interface: 'badUi'
        }
      );
    });
  });

  describe('createForbiddenExclusivityError()', function() {
    describe('when Mocha instance is running in a worker process', function() {
      it('should output a message regarding incompatibility', function() {
        var mocha = {isWorker: true};
        expect(
          errors.createForbiddenExclusivityError(mocha, {}),
          'to satisfy',
          {
            message: /parallel/,
            code: errors.constants.FORBIDDEN_EXCLUSIVITY
          }
        );
      });
    });

    describe('when Mocha instance is not running in a worker process', function() {
      it('should output a message regarding --forbid-only', function() {
        var mocha = {};
        expect(
          errors.createForbiddenExclusivityError(mocha, {}),
          'to satisfy',
          {
            message: /--forbid-only/,
            code: errors.constants.FORBIDDEN_EXCLUSIVITY
          }
        );
      });
    });
  });
});
