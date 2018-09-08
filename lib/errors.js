'use strict';
/**
 * @module Custom Errors
 */
/**
 * Custom Errors
 */

/**
 * @summary
 * File/s of test could not be found.
 *
 * @public
 * @example
 * // import custom errors
 * const errors = require('./errors');
 * const ErrorInvalidArgValue = errors.ErrorInvalidArgValue;
 *
 * throw new ErrorInvalidArgValue('Our error message');
 *
 * // to use it:
 * const errors = require('./errors');
 * const NoFilesMatchPatternError = errors.NoFilesMatchPatternError
 *
 * if (someError instanceof NoFilesMatchPatternError) {
 *  // ...
 * }
 */
function NoFilesMatchPatternError(message, pattern) {
  this.name = 'NoFilesMatchPatternError';
  this.code = 'ERR_MOCHA_NO_FILES_MATCH_PATTERN';
  this.pattern = pattern;
  this.message = message;
  Error.captureStackTrace(this, NoFilesMatchPatternError);
}
NoFilesMatchPatternError.prototype = Object.create(Error.prototype);
NoFilesMatchPatternError.prototype.name = NoFilesMatchPatternError.name;
NoFilesMatchPatternError.prototype.constructor = NoFilesMatchPatternError;

/**
 * @summary
 * Callback for a running suite was not found.
 *
 * @public
 */
function MissingCallbackError(message) {
  this.name = 'MissingCallbackError';
  this.code = 'ERR_MOCHA_MISSING_CALLBACK';
  this.message = message;
  Error.captureStackTrace(this, MissingCallbackError);
}
MissingCallbackError.prototype = Object.create(Error.prototype);
MissingCallbackError.prototype.name = MissingCallbackError.name;
MissingCallbackError.prototype.constructor = MissingCallbackError;

/**
 * @summary
 * Reporter specified in options not found.
 *
 * @public
 */
function InvalidReporterError(message) {
  this.name = 'InvalidReporterError';
  this.code = 'ERR_MOCHA_INVALID_REPORTER';
  this.message = message;
  Error.captureStackTrace(this, InvalidReporterError);
}
InvalidReporterError.prototype = Object.create(Error.prototype);
InvalidReporterError.prototype.name = InvalidReporterError.name;
InvalidReporterError.prototype.constructor = InvalidReporterError;

/**
 * @summary
 * Interface specified in options not found.
 *
 * @public
 */
function InvalidInterfaceError(message) {
  this.name = 'InvalidInterfaceError';
  this.code = 'ERR_MOCHA_INVALID_INTERFACE';
  this.message = message;
  Error.captureStackTrace(this, InvalidInterfaceError);
}
InvalidInterfaceError.prototype = Object.create(Error.prototype);
InvalidInterfaceError.prototype.name = InvalidInterfaceError.name;
InvalidInterfaceError.prototype.constructor = InvalidInterfaceError;

/**
 * @summary
 * Type of output specified was not supported.
 *
 * @public
 */
function NotSupportedError(message) {
  this.name = 'NotSupportedError';
  this.code = 'ERR_MOCHA_NOT_SUPPORTED';
  this.message = message;
  Error.captureStackTrace(this, NotSupportedError);
}
NotSupportedError.prototype = Object.create(Error.prototype);
NotSupportedError.prototype.name = NotSupportedError.name;
NotSupportedError.prototype.constructor = NotSupportedError;

/**
 * @summary
 * An invalid argument value was found.
 *
 * @public
 */
function InvalidArgumentValueError(message) {
  this.name = 'InvalidArgumentValueError';
  this.code = 'ERR_MOCHA_INVALID_ARG_VALUE';
  this.message = message;
  Error.captureStackTraceError(this, InvalidArgumentValueError);
}
InvalidArgumentValueError.prototype = Object.create(Error.prototype);
InvalidArgumentValueError.prototype.name = InvalidArgumentValueError.name;
InvalidArgumentValueError.prototype.constructor = InvalidArgumentValueError;

/**
 * @summary
 * An argument was missing.
 *
 * @public
 */
function MissingArgumentError(message, argument) {
  this.name = 'MissingArgumentError';
  this.code = 'ERR_MOCHA_MISSING_ARGUMENT';
  this.argument = argument;
  this.message = message;
  Error.captureStackTrace(this, MissingArgumentError);
}
MissingArgumentError.prototype = Object.create(Error.prototype);
MissingArgumentError.prototype.name = MissingArgumentError.name;
MissingArgumentError.prototype.constructor = MissingArgumentError;

/**
 * @summary
 * An error was thrown but no details were specified.
 *
 * @public
 */
function UndefinedError(message) {
  this.name = 'UndefinedError';
  this.code = 'ERR_MOCHA_UNDEFINED_ERROR';
  this.message = message;
  Error.captureStackTrace(this, UndefinedError);
}
UndefinedError.prototype = Object.create(Error.prototype);
UndefinedError.prototype.name = UndefinedError.name;
UndefinedError.prototype.constructor = UndefinedError;

module.exports = {
  NoFilesMatchPatternError: NoFilesMatchPatternError,
  MissingCallbackError: MissingCallbackError,
  InvalidReporterError: InvalidReporterError,
  InvalidInterfaceError: InvalidInterfaceError,
  NotSupportedError: NotSupportedError,
  InvalidArgumentValueError: InvalidArgumentValueError,
  MissingArgumentError: MissingArgumentError,
  UndefinedError: UndefinedError
};
