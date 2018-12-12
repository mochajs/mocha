'use strict';

var errors = require('../../lib/errors');

describe('Errors', function() {
  var expectedMessage = 'some message';
  it('should include expected code in throw reporter errors', function() {
    var throwError = function() {
      throw errors.InvalidReporterError(expectedMessage);
    };
    expect(throwError, 'to throw', {
      message: expectedMessage,
      code: 'ERR_MOCHA_INVALID_REPORTER'
    });
  });

  it('should include expected code in throw interface errors', function() {
    var throwError = function() {
      throw errors.InvalidInterfaceError(expectedMessage);
    };
    expect(throwError, 'to throw', {
      message: expectedMessage,
      code: 'ERR_MOCHA_INVALID_INTERFACE'
    });
  });
});
