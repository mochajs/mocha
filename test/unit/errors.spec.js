'use strict';

var errors = require('../../lib/errors');

describe('Errors', function() {
  var expectedMessage = 'some message';
  it('should include expected code in thrown reporter errors', function() {
    var throwError = function() {
      throw errors.createInvalidReporterError(expectedMessage, 'badReporter');
    };
    expect(throwError, 'to throw', {
      message: expectedMessage,
      code: 'ERR_MOCHA_INVALID_REPORTER',
      reporter: 'badReporter'
    });
  });

  var missingFile = ['not-exist'];
  var expectedErrorMessage = 'files not exists' + missingFile;
  it('should include expected code in thrown not existing errors', function() {
    var throwError = function() {
      throw errors.createFileNotExistsError(expectedErrorMessage);
    };
    expect(throwError, 'to throw', {
      message: expectedErrorMessage,
      code: 'ERR_MOCHA_FILE_NOT_FOUND'
    });
  });

  var invalidExceptionErrorMessage = 'invalid message';
  it('should include expected code in thrown not existing errors', function() {
    var throwError = function() {
      throw errors.createInvalidExceptionError(
        invalidExceptionErrorMessage,
        []
      );
    };
    expect(throwError, 'to throw', {
      message: invalidExceptionErrorMessage,
      code: 'ERR_MOCHA_INVALID_EXCEPTION'
    });
  });

  it('should include expected code in thrown interface errors', function() {
    var throwError = function() {
      throw errors.createInvalidInterfaceError(expectedMessage, 'badUi');
    };
    expect(throwError, 'to throw', {
      message: expectedMessage,
      code: 'ERR_MOCHA_INVALID_INTERFACE',
      interface: 'badUi'
    });
  });
});
