'use strict';
/**
 * @module Errors
 */
/**
 * Factory functions to create throwable error objects
 */

/**
 * Creates an error object used when no files to be tested could be found using specified pattern.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} pattern - User-specified argument value.
 * @returns {Error} instance detailing the error condition
 */
function createNoFilesMatchPatternError(message, pattern) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_NO_FILES_MATCH_PATTERN';
  err.pattern = pattern;
  return err;
}

/**
 * Creates an error object used when the reporter specified in the options was not found.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} reporter - User-specified reporter value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidReporterError(message, reporter) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_INVALID_REPORTER';
  err.reporter = reporter;
  return err;
}

/**
 * Creates an error object used when the interface specified in the options was not found.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} ui - User-specified interface value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidInterfaceError(message, ui) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_INVALID_INTERFACE';
  err.interface = ui;
  return err;
}

/**
 * Creates an error object used when the type of output specified was not supported.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createNotSupportedError(message) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_NOT_SUPPORTED';
  return err;
}

/**
 * Creates an error object used when an argument is missing.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createMissingArgumentError(message, argument, expected) {
  return createInvalidArgumentTypeError(message, argument, expected);
}

/**
 * Creates an error object used when an argument did not use the supported type
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentTypeError(message, argument, expected) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_INVALID_ARG_TYPE';
  err.argument = argument;
  err.expected = expected;
  err.actual = typeof argument;
  return err;
}

/**
 * Creates an error object used when an argument did not use the supported value
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} value - Argument value.
 * @param {string} [reason] - Why value is invalid.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentValueError(message, argument, value, reason) {
  var err = new TypeError(message);
  err.code = 'ERR_MOCHA_INVALID_ARG_VALUE';
  err.argument = argument;
  err.value = value;
  err.reason = typeof reason !== 'undefined' ? reason : 'is invalid';
  return err;
}

/**
 * Creates an error object used when an error was thrown but no details were specified.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createUndefinedError(message) {
  var err = new Error(message);
  err.code = 'ERR_MOCHA_UNDEFINED_ERROR';
  return err;
}

module.exports = {
  createInvalidArgumentTypeError: createInvalidArgumentTypeError,
  createInvalidArgumentValueError: createInvalidArgumentValueError,
  createInvalidInterfaceError: createInvalidInterfaceError,
  createInvalidReporterError: createInvalidReporterError,
  createMissingArgumentError: createMissingArgumentError,
  createNoFilesMatchPatternError: createNoFilesMatchPatternError,
  createNotSupportedError: createNotSupportedError,
  createUndefinedError: createUndefinedError
};
