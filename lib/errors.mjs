/**
 * @typedef {import('./mocha.js')} Mocha
 * @typedef {import('./runnable.mjs')} Runnable
 * @typedef {import('./types.d.ts').MochaTimeoutError} MochaTimeoutError
 * @typedef {import('./types.d.ts').PluginDefinition} PluginDefinition
 */

import { format } from "node:util";
import { constants } from "./error-constants.mjs";
import { isCI } from "./utils.js";

/**
 * Contains error codes and factory functions to create throwable error objects
 * @module
 */

/**
 * A set containing all string values of all Mocha error constants, for use by {@link isMochaError}.
 * @private
 */
const MOCHA_ERRORS = new Set(Object.values(constants));

/**
 * Creates an error object to be thrown when no files to be tested could be found using specified pattern.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @param {string} pattern - User-specified argument value.
 * @returns {Error} instance detailing the error condition
 */
function createNoFilesMatchPatternError(message, pattern) {
  var err = new Error(message);
  err.code = constants.NO_FILES_MATCH_PATTERN;
  err.pattern = pattern;
  return err;
}

/**
 * Creates an error object to be thrown when the reporter specified in the options was not found.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} reporter - User-specified reporter value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidReporterError(message, reporter) {
  var err = new TypeError(message);
  err.code = constants.INVALID_REPORTER;
  err.reporter = reporter;
  return err;
}

/**
 * Creates an error object to be thrown when the interface specified in the options was not found.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @param {string} ui - User-specified interface value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidInterfaceError(message, ui) {
  var err = new Error(message);
  err.code = constants.INVALID_INTERFACE;
  err.interface = ui;
  return err;
}

/**
 * Creates an error object to be thrown when a behavior, option, or parameter is unsupported.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createUnsupportedError(message) {
  var err = new Error(message);
  err.code = constants.UNSUPPORTED;
  return err;
}

/**
 * Creates an error object to be thrown when an argument is missing.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createMissingArgumentError(message, argument, expected) {
  return createInvalidArgumentTypeError(message, argument, expected);
}

/**
 * Creates an error object to be thrown when an argument did not use the supported type
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentTypeError(message, argument, expected) {
  var err = new TypeError(message);
  err.code = constants.INVALID_ARG_TYPE;
  err.argument = argument;
  err.expected = expected;
  err.actual = typeof argument;
  return err;
}

/**
 * Creates an error object to be thrown when an argument did not use the supported value
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} value - Argument value.
 * @param {string} [reason] - Why value is invalid.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentValueError(message, argument, value, reason) {
  var err = new TypeError(message);
  err.code = constants.INVALID_ARG_VALUE;
  err.argument = argument;
  err.value = value;
  err.reason = typeof reason !== "undefined" ? reason : "is invalid";
  return err;
}

/**
 * Creates an error object to be thrown when an exception was caught, but the `Error` is falsy or undefined.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidExceptionError(message, value) {
  var err = new Error(message);
  err.code = constants.INVALID_EXCEPTION;
  err.valueType = typeof value;
  err.value = value;
  return err;
}

/**
 * Creates an error object to be thrown when an unrecoverable error occurs.
 *
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createFatalError(message, value) {
  var err = new Error(message);
  err.code = constants.FATAL;
  err.valueType = typeof value;
  err.value = value;
  return err;
}

/**
 * Dynamically creates a plugin-type-specific error based on plugin type
 * @param {string} message - Error message
 * @param {"reporter"|"ui"} pluginType - Plugin type. Future: expand as needed
 * @param {string} [pluginId] - Name/path of plugin, if any
 * @throws When `pluginType` is not known
 * @public
 * @static
 * @returns {Error}
 */
function createInvalidLegacyPluginError(message, pluginType, pluginId) {
  switch (pluginType) {
    case "reporter":
      return createInvalidReporterError(message, pluginId);
    case "ui":
      return createInvalidInterfaceError(message, pluginId);
    default:
      throw new Error('unknown pluginType "' + pluginType + '"');
  }
}

/**
 * Creates an error object to be thrown when a mocha object's `run` method is executed while it is already disposed.
 * @param {string} message The error message to be displayed.
 * @param {boolean} cleanReferencesAfterRun the value of `cleanReferencesAfterRun`
 * @param {Mocha} instance the mocha instance that throw this error
 * @static
 */
function createMochaInstanceAlreadyDisposedError(
  message,
  cleanReferencesAfterRun,
  instance,
) {
  var err = new Error(message);
  err.code = constants.INSTANCE_ALREADY_DISPOSED;
  err.cleanReferencesAfterRun = cleanReferencesAfterRun;
  err.instance = instance;
  return err;
}

/**
 * Creates an error object to be thrown when a mocha object's `run` method is called while a test run is in progress.
 * @param {string} message The error message to be displayed.
 * @static
 * @public
 */
function createMochaInstanceAlreadyRunningError(message, instance) {
  var err = new Error(message);
  err.code = constants.INSTANCE_ALREADY_RUNNING;
  err.instance = instance;
  return err;
}

/**
 * Creates an error object to be thrown when done() is called multiple times in a test
 *
 * @public
 * @param {Runnable} runnable - Original runnable
 * @param {Error} [originalErr] - Original error, if any
 * @returns {Error} instance detailing the error condition
 * @static
 */
function createMultipleDoneError(runnable, originalErr) {
  var title;
  try {
    title = format("<%s>", runnable.fullTitle());
    if (runnable.parent.root) {
      title += " (of root suite)";
    }
  } catch {
    title = format("<%s> (of unknown suite)", runnable.title);
  }
  var message = format(
    "done() called multiple times in %s %s",
    runnable.type ? runnable.type : "unknown runnable",
    title,
  );
  if (runnable.file) {
    message += format(" of file %s", runnable.file);
  }
  if (originalErr) {
    message += format("; in addition, done() received error: %s", originalErr);
  }

  var err = new Error(message);
  err.code = constants.MULTIPLE_DONE;
  err.valueType = typeof originalErr;
  err.value = originalErr;
  return err;
}

/**
 * Creates an error object to be thrown when `.only()` is used with
 * `--forbid-only`.
 * @static
 * @public
 * @param {Mocha} mocha - Mocha instance
 * @returns {Error} Error with code {@link constants.FORBIDDEN_EXCLUSIVITY}
 */
function createForbiddenExclusivityError(mocha) {
  var message;
  if (mocha.isWorker) {
    message = "`.only` is not supported in parallel mode";
  } else {
    message = "`.only` forbidden by --forbid-only";
    if (isCI()) {
      message += " (default in CI, add `--no-forbid-only` to allow `.only`)";
    }
  }

  var err = new Error(message);
  err.code = constants.FORBIDDEN_EXCLUSIVITY;
  return err;
}

/**
 * Creates an error object to be thrown when a plugin definition is invalid
 * @static
 * @param {string} msg - Error message
 * @param {PluginDefinition} [pluginDef] - Problematic plugin definition
 * @public
 * @returns {Error} Error with code {@link constants.INVALID_PLUGIN_DEFINITION}
 */
function createInvalidPluginDefinitionError(msg, pluginDef) {
  const err = new Error(msg);
  err.code = constants.INVALID_PLUGIN_DEFINITION;
  err.pluginDef = pluginDef;
  return err;
}

/**
 * Creates an error object to be thrown when a plugin implementation (user code) is invalid
 * @static
 * @param {string} msg - Error message
 * @param {Object} [opts] - Plugin definition and user-supplied implementation
 * @param {PluginDefinition} [opts.pluginDef] - Plugin Definition
 * @param {*} [opts.pluginImpl] - Plugin Implementation (user-supplied)
 * @public
 * @returns {Error} Error with code {@link constants.INVALID_PLUGIN_DEFINITION}
 */
function createInvalidPluginImplementationError(
  msg,
  { pluginDef, pluginImpl } = {},
) {
  const err = new Error(msg);
  err.code = constants.INVALID_PLUGIN_IMPLEMENTATION;
  err.pluginDef = pluginDef;
  err.pluginImpl = pluginImpl;
  return err;
}

/**
 * Creates an error object to be thrown when a runnable exceeds its allowed run time.
 * @static
 * @param {string} msg - Error message
 * @param {number} [timeout] - Timeout in ms
 * @param {string} [file] - File, if given
 * @returns {MochaTimeoutError}
 */
function createTimeoutError(msg, timeout, file) {
  const err = new Error(msg);
  err.code = constants.TIMEOUT;
  err.timeout = timeout;
  err.file = file;
  return err;
}

/**
 * Creates an error object to be thrown when file is unparsable
 * @public
 * @static
 * @param {string} message - Error message to be displayed.
 * @returns {Error} Error with code {@link constants.UNPARSABLE_FILE}
 */
function createUnparsableFileError(message) {
  var err = new Error(message);
  err.code = constants.UNPARSABLE_FILE;
  return err;
}

/**
 * Returns `true` if an error came out of Mocha.
 * _Can suffer from false negatives, but not false positives._
 * @static
 * @public
 * @param {*} err - Error, or anything
 * @returns {boolean}
 */
const isMochaError = (err) =>
  Boolean(err && typeof err === "object" && MOCHA_ERRORS.has(err.code));

export {
  createFatalError,
  createForbiddenExclusivityError,
  createInvalidArgumentTypeError,
  createInvalidArgumentValueError,
  createInvalidExceptionError,
  createInvalidInterfaceError,
  createInvalidLegacyPluginError,
  createInvalidPluginDefinitionError,
  createInvalidPluginImplementationError,
  createInvalidReporterError,
  createMissingArgumentError,
  createMochaInstanceAlreadyDisposedError,
  createMochaInstanceAlreadyRunningError,
  createMultipleDoneError,
  createNoFilesMatchPatternError,
  createTimeoutError,
  createUnparsableFileError,
  createUnsupportedError,
  isMochaError,
};
