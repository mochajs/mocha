'use strict';

/**
 * Module dependencies.
 */
var sprintf = require('util').format;
var ConsoleWriter = require('./console');
var FileWriter = require('./file');
var StreamWriter = require('./stream');

/**
 * Provides methods used for output by reporters.
 *
 * @description
 * Not meant to be used directly. Runtime-adaptive.
 * Once _any_ functional mixin method is iinvoked, specializations will occur
 * which may augment/replace existing methods/properties.
 *
 * @public
 * @mixin ReportWriter
 * @example
 * var ReportWriter = require('./writers/report');
 * var MyReporter = function(runner, options) {
 *   runner.on(EVENT_TEST_PASS, function(test) {
 *     this.println(test);
 *   });
 * };
 * ReportWriter.call(MyReporter.prototype);
 */
var ReportWriter = function() {
  /**
   * Adapts prototype methods to specific output destination.
   *
   * @param {Object} reporter - Reporter instance
   * @returns {reporter}
   * @chainable
   */
  function adapt(reporter) {
    var preferConsole = !!reporter.preferConsole;

    // :DEBUG: console.log('reporter:', reporter);
    if (ReportWriter.isFileWriter(reporter)) {
      // :DEBUG: console.log('### specialized as FileWriter');
      FileWriter.call(reporter);
    } else if (!preferConsole && ReportWriter.stdoutExists()) {
      // :DEBUG: console.log('### specialized as StreamWriter');
      StreamWriter.call(reporter);
    } else {
      // :DEBUG: console.log('### specialized as ConsoleWriter');
      ConsoleWriter.call(reporter);
    }

    return reporter;
  }

  /**
   * Writes string to reporter output.
   *
   * @description
   * Overrides this class method by creating same-named instance method.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.write = function(str) {
    return adapt(this).write(str);
  };

  /**
   * Writes newline-terminated string to reporter output.
   *
   * @description
   * Overrides this class method by creating same-named instance method.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.writeln = function(str) {
    return adapt(this).writeln(str);
  };

  /**
   * Writes formatted string to reporter output.
   * @see {@link https://nodejs.org/api/util.html#util_util_format_format_args}
   *
   * @package
   * @param {string} format - `printf`-like format string
   * @param {...*} [varArgs] - Format string arguments
   * @returns {this}
   * @chainable
   */
  this.print = function(format, varArgs) {
    var vargs = Array.prototype.slice.call(arguments);
    var str = sprintf.apply(null, vargs);
    return this.write(str);
  };

  /**
   * Writes newline-terminated formatted string to reporter output.
   *
   * @package
   * @param {string} format - `printf`-like format string
   * @param {...*} [varArgs] - Format string arguments
   * @returns {this}
   * @chainable
   */
  this.println = function(format, varArgs) {
    var vargs = Array.prototype.slice.call(arguments);
    vargs[0] += '\n';
    return this.print(this, vargs);
  };

  /**
   * Invokes provided completion function.
   *
   * @package
   * @param {number} nfailures - Count of failed tests (integer)
   * @param {DoneCB} fn - Callback invoked when test execution completes
   */
  this.done = function(nfailures, fn) {
    if (this._done) {
      this._done(function() {
        fn(nfailures);
      });
    } else {
      fn(nfailures);
    }
  };

  return this;
};

/**
 * Attempts creation of filesystem output stream, if
 * <code>reporter.options.output</code> given.
 *
 * @public
 * @static
 * @param {Object} reporter - Instance of reporter
 * @throws Various errors are possible if file creation attempted
 */
ReportWriter.maybeCreateFileOutput = function(reporter) {
  var reporterOptions = (reporter.options || {}).reporterOptions || {};
  var pathname = reporterOptions.output;

  if (pathname) {
    FileWriter.createWriteStream(reporter, pathname);
  }
};

/**
 * Determines if writer can write output to filesystem.
 *
 * @private
 * @static
 * @param {Object} reporter - Instance of reporter
 * @returns {boolean} whether writer should use `FileWriter` methods
 */
ReportWriter.isFileWriter = function(reporter) {
  return FileWriter.isFileWriter(reporter);
};

/**
 * Determines if `process.stdout` exists in current execution environment.
 *
 * @description
 * On PhantomJS, `process.stdout` doesn't exist...
 *
 * @public
 * @static
 * @returns {boolean} whether `process.stdout` can be used
 */
ReportWriter.stdoutExists = function() {
  return typeof process === 'object' && !!process.stdout;
};

module.exports = ReportWriter;
