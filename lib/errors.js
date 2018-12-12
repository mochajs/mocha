'use strict';
/**
 * @module Errors
 */
/**
 * Factory functions to create throwable error objects
 */

/**
 * @summary
 * File/s of test could not be found.
 *
 * @public
 */
function NoFilesMatchPatternError(message, pattern) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_NO_FILES_MATCH_PATTERN';
  errorWithCode.pattern = pattern;
  return errorWithCode;
}

/**
 * @summary
 * Callback for a running suite was not found.
 *
 * @public
 */
function MissingCallbackError(message) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_MISSING_CALLBACK';
  return errorWithCode;
}
/**
 * @summary
 * Reporter specified in options not found.
 *
 * @public
 */
function InvalidReporterError(message) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_INVALID_REPORTER';
  return errorWithCode;
}

/**
 * @summary
 * Interface specified in options not found.
 *
 * @public
 */
function InvalidInterfaceError(message) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_INVALID_INTERFACE';
  return errorWithCode;
}

/**
 * @summary
 * Type of output specified was not supported.
 *
 * @public
 */
function NotSupportedError(message) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_NOT_SUPPORTED';
  return errorWithCode;
}

/**
 * @summary
 * An argument was missing.
 *
 * @public
 */
function MissingArgumentError(message, argument) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_MISSING_ARGUMENT';
  errorWithCode.argument = argument;
  return errorWithCode;
}

/**
 * @summary
 * An error was thrown but no details were specified.
 *
 * @public
 */
function UndefinedError(message) {
  var errorWithCode = new Error(message);
  errorWithCode.code = 'ERR_MOCHA_UNDEFINED_ERROR';
  return errorWithCode;
}

module.exports = {
  NoFilesMatchPatternError: NoFilesMatchPatternError,
  MissingCallbackError: MissingCallbackError,
  InvalidReporterError: InvalidReporterError,
  InvalidInterfaceError: InvalidInterfaceError,
  NotSupportedError: NotSupportedError,
  MissingArgumentError: MissingArgumentError,
  UndefinedError: UndefinedError
};
