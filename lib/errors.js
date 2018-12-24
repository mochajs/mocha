'use strict';
/**
 * @module Errors
 */
/**
 * Factory functions to create throwable error objects
 */

/**
 * File/s of test could not be found.
 *
 * @public
 */
function createNoFilesMatchPatternError(message, pattern) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_NO_FILES_MATCH_PATTERN';
  err.pattern = pattern;
  return err;
}

/**
 * Reporter specified in options not found.
 *
 * @public
 */
function createInvalidReporterError(message, reporter) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_INVALID_REPORTER';
  err.reporter = reporter;
  return err;
}

/**
 * Interface specified in options not found.
 *
 * @public
 */
function createInvalidInterfaceError(message, badInterface) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_INVALID_INTERFACE';
  err.interface = badInterface;
  return err;
}

/**
 * Type of output specified was not supported.
 *
 * @public
 */
function createNotSupportedError(message) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_NOT_SUPPORTED';
  return err;
}

/**
 * Callback for a running suite was not found.
 *
 * @public
 */
function createMissingCallbackError(message) {
  var err = createMissingArgumentError(message, 'callback');
  err.code = 'ERR_MOCHA_MISSING_CALLBACK';
  return err;
}

/**
 * An argument was missing.
 *
 * @public
 */
function createMissingArgumentError(message, argument) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_MISSING_ARG_TYPE';
  err.argument = argument;
  return err;
}

/**
 * An argument used did not use the supported type
 *
 * @public
 */
function createArgumentTypeError(message, argument, expected) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_INVALID_ARG_TYPE';
  err.argument = argument;
  err.expected = expected;
  err.actual = typeof argument;
  throw err;
}

/**
 * An error was thrown but no details were specified.
 *
 * @public
 */
function createUndefinedError(message) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_UNDEFINED_ERROR';
  return err;
}

module.exports = {
  createNoFilesMatchPatternError: createNoFilesMatchPatternError,
  createMissingCallbackError: createMissingCallbackError,
  createInvalidReporterError: createInvalidReporterError,
  createInvalidInterfaceError: createInvalidInterfaceError,
  createNotSupportedError: createNotSupportedError,
  createMissingArgumentError: createMissingArgumentError,
  createUndefinedError: createUndefinedError,
  createArgumentTypeError: createArgumentTypeError
};
