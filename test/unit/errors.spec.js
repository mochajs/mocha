'use strict';

var errors = require('../../lib/errors');
const sinon = require('sinon');
const {createNoFilesMatchPatternError} = require('../../lib/errors');

describe('Errors', function () {
  afterEach(function () {
    sinon.restore();
  });

  var message = 'some message';

  describe('createInvalidReporterError()', function () {
    it('should include expected code in thrown reporter errors', function () {
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

  describe('createInvalidInterfaceError()', function () {
    it('should include expected code in thrown interface errors', function () {
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

  describe('createForbiddenExclusivityError()', function () {
    describe('when Mocha instance is running in a worker process', function () {
      it('should output a message regarding incompatibility', function () {
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

    describe('when Mocha instance is not running in a worker process', function () {
      it('should output a message regarding --forbid-only', function () {
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

  describe('createUnparsableFileError()', function () {
    it('should include expected code in thrown unparsable file errors', function () {
      expect(
        errors.createUnparsableFileError(message, 'badFilePath'),
        'to satisfy',
        {
          message: message,
          code: 'ERR_MOCHA_UNPARSABLE_FILE'
        }
      );
    });
  });

  describe('deprecate()', function () {
    var emitWarning;

    beforeEach(function () {
      if (process.emitWarning) {
        emitWarning = process.emitWarning;
        sinon.stub(process, 'emitWarning');
      } else {
        process.emitWarning = sinon.spy();
      }
      errors.deprecate.cache = {};
    });

    afterEach(function () {
      // if this is not set, then we created it, so we should remove it.
      if (!emitWarning) {
        delete process.emitWarning;
      }
    });

    it('should coerce its parameter to a string', function () {
      errors.deprecate(1);
      expect(process.emitWarning, 'to have a call satisfying', [
        '1',
        'DeprecationWarning'
      ]);
    });

    it('should cache the message', function () {
      errors.deprecate('foo');
      errors.deprecate('foo');
      expect(process.emitWarning, 'was called times', 1);
    });

    it('should ignore falsy messages', function () {
      errors.deprecate('');
      expect(process.emitWarning, 'was not called');
    });
  });

  describe('warn()', function () {
    var emitWarning;

    beforeEach(function () {
      if (process.emitWarning) {
        emitWarning = process.emitWarning;
        sinon.stub(process, 'emitWarning');
      } else {
        process.emitWarning = sinon.spy();
      }
    });

    afterEach(function () {
      // if this is not set, then we created it, so we should remove it.
      if (!emitWarning) {
        delete process.emitWarning;
      }
    });

    it('should call process.emitWarning', function () {
      errors.warn('foo');
      expect(process.emitWarning, 'was called times', 1);
    });

    it('should not cache messages', function () {
      errors.warn('foo');
      errors.warn('foo');
      expect(process.emitWarning, 'was called times', 2);
    });

    it('should ignore falsy messages', function () {
      errors.warn('');
      expect(process.emitWarning, 'was not called');
    });
  });

  describe('isMochaError()', function () {
    describe('when provided an Error object having a known Mocha error code', function () {
      it('should return true', function () {
        expect(
          errors.isMochaError(createNoFilesMatchPatternError('derp')),
          'to be true'
        );
      });
    });

    describe('when provided an Error object with a non-Mocha error code', function () {
      it('should return false', function () {
        const err = new Error();
        err.code = 'ENOTEA';
        expect(errors.isMochaError(err), 'to be false');
      });
    });

    describe('when provided a non-error', function () {
      it('should return false', function () {
        expect(errors.isMochaError(), 'to be false');
      });
    });
  });
});
