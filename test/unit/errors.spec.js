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
