'use strict';

/*!
 * mocha
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var escapeRe = require('escape-string-regexp');
var path = require('path');
var builtinReporters = require('./reporters');
var growl = require('./growl');
var utils = require('./utils');
var mocharc = require('./mocharc.json');
var errors = require('./errors');
var Suite = require('./suite');
var createStatsCollector = require('./stats-collector');
var createInvalidReporterError = errors.createInvalidReporterError;
var createInvalidInterfaceError = errors.createInvalidInterfaceError;
var EVENT_FILE_PRE_REQUIRE = Suite.constants.EVENT_FILE_PRE_REQUIRE;
var EVENT_FILE_POST_REQUIRE = Suite.constants.EVENT_FILE_POST_REQUIRE;
var EVENT_FILE_REQUIRE = Suite.constants.EVENT_FILE_REQUIRE;
var sQuote = utils.sQuote;

exports = module.exports = Mocha;

/**
 * To require local UIs and reporters when running in node.
 */

if (!process.browser) {
  var cwd = process.cwd();
  module.paths.push(cwd, path.join(cwd, 'node_modules'));
}

/**
 * Expose internals.
 */

/**
 * @public
 * @class utils
 * @memberof Mocha
 */
exports.utils = utils;
exports.interfaces = require('./interfaces');
/**
 * @public
 * @memberof Mocha
 */
exports.reporters = builtinReporters;
exports.Runnable = require('./runnable');
exports.Context = require('./context');
/**
 *
 * @memberof Mocha
 */
exports.Runner = require('./runner');
exports.Suite = Suite;
exports.Hook = require('./hook');
exports.Test = require('./test');

/**
 * Constructs a new Mocha instance with `options`.
 *
 * @public
 * @class Mocha
 * @param {Object} [options] - Settings object.
 * @param {boolean} [options.allowUncaught] - Propagate uncaught errors?
 * @param {boolean} [options.asyncOnly] - Force `done` callback or promise?
 * @param {boolean} [options.bail] - Bail after first test failure?
 * @param {boolean} [options.checkLeaks] - If true, check leaks.
 * @param {boolean} [options.delay] - Delay root suite execution?
 * @param {boolean} [options.enableTimeouts] - Enable timeouts?
 * @param {string} [options.fgrep] - Test filter given string.
 * @param {boolean} [options.forbidOnly] - Tests marked `only` fail the suite?
 * @param {boolean} [options.forbidPending] - Pending tests fail the suite?
 * @param {boolean} [options.fullStackTrace] - Full stacktrace upon failure?
 * @param {string[]} [options.global] - Variables expected in global scope.
 * @param {RegExp|string} [options.grep] - Test filter given regular expression.
 * @param {boolean} [options.growl] - Enable desktop notifications?
 * @param {boolean} [options.hideDiff] - Suppress diffs from failures?
 * @param {boolean} [options.ignoreLeaks] - Ignore global leaks?
 * @param {boolean} [options.invert] - Invert test filter matches?
 * @param {boolean} [options.noHighlighting] - Disable syntax highlighting?
 * @param {string} [options.reporter] - Reporter name.
 * @param {Object} [options.reporterOption] - Reporter settings object.
 * @param {number} [options.retries] - Number of times to retry failed tests.
 * @param {number} [options.slow] - Slow threshold value.
 * @param {number|string} [options.timeout] - Timeout threshold value.
 * @param {string} [options.ui] - Interface name.
 * @param {boolean} [options.color] - Color TTY output from reporter?
 * @param {boolean} [options.useInlineDiffs] - Use inline diffs?
 */
function Mocha(options) {
  options = utils.assign({}, mocharc, options || {});
  this.files = [];
  this.options = options;
  // root suite
  this.suite = new exports.Suite('', new exports.Context(), true);

  if ('useColors' in options) {
    utils.deprecate(
      'useColors is DEPRECATED and will be removed from a future version of Mocha. Instead, use the "color" option'
    );
    options.color = 'color' in options ? options.color : options.useColors;
  }

  this.grep(options.grep)
    .fgrep(options.fgrep)
    .ui(options.ui)
    .bail(options.bail)
    .reporter(options.reporter, options.reporterOptions)
    .useColors(options.color)
    .slow(options.slow)
    .useInlineDiffs(options.inlineDiffs)
    .globals(options.globals);

  if ('enableTimeouts' in options) {
    utils.deprecate(
      'enableTimeouts is DEPRECATED and will be removed from a future version of Mocha. Instead, use "timeout: false" to disable timeouts.'
    );
    if (options.enableTimeouts === false) {
      this.timeout(0);
    }
  }

  // this guard exists because Suite#timeout does not consider `undefined` to be valid input
  if (typeof options.timeout !== 'undefined') {
    this.timeout(options.timeout === false ? 0 : options.timeout);
  }

  if ('retries' in options) {
    this.retries(options.retries);
  }

  if ('diff' in options) {
    this.hideDiff(!options.diff);
  }

  [
    'allowUncaught',
    'asyncOnly',
    'checkLeaks',
    'delay',
    'forbidOnly',
    'forbidPending',
    'fullTrace',
    'growl',
    'invert'
  ].forEach(function(opt) {
    if (options[opt]) {
      this[opt]();
    }
  }, this);
}

/**
 * Enables or disables bailing on the first failure.
 *
 * @public
 * @see {@link https://mochajs.org/#-b---bail|CLI option}
 * @param {boolean} [bail=true] - Whether to bail on first error.
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.bail = function(bail) {
  if (!arguments.length) {
    bail = true;
  }
  this.suite.bail(bail);
  return this;
};

/**
 * @summary
 * Adds `file` to be loaded for execution.
 *
 * @description
 * Useful for generic setup code that must be included within test suite.
 *
 * @public
 * @see {@link https://mochajs.org/#--file-file|CLI option}
 * @param {string} file - Pathname of file to be loaded.
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.addFile = function(file) {
  this.files.push(file);
  return this;
};

/**
 * Sets reporter to `reporter`, defaults to "spec".
 *
 * @public
 * @see {@link https://mochajs.org/#-r---reporter-name|CLI option}
 * @see {@link https://mochajs.org/#reporters|Reporters}
 * @param {String|Function} reporter - Reporter name or constructor.
 * @param {Object} [reporterOptions] - Options used to configure the reporter.
 * @returns {Mocha} this
 * @chainable
 * @throws {Error} if requested reporter cannot be loaded
 * @example
 *
 * // Use XUnit reporter and direct its output to file
 * mocha.reporter('xunit', { output: '/path/to/testspec.xunit.xml' });
 */
Mocha.prototype.reporter = function(reporter, reporterOptions) {
  if (typeof reporter === 'function') {
    this._reporter = reporter;
  } else {
    reporter = reporter || 'spec';
    var _reporter;
    // Try to load a built-in reporter.
    if (builtinReporters[reporter]) {
      _reporter = builtinReporters[reporter];
    }
    // Try to load reporters from process.cwd() and node_modules
    if (!_reporter) {
      try {
        _reporter = require(reporter);
      } catch (err) {
        if (
          err.code !== 'MODULE_NOT_FOUND' ||
          err.message.indexOf('Cannot find module') !== -1
        ) {
          // Try to load reporters from a path (absolute or relative)
          try {
            _reporter = require(path.resolve(process.cwd(), reporter));
          } catch (_err) {
            _err.code !== 'MODULE_NOT_FOUND' ||
            _err.message.indexOf('Cannot find module') !== -1
              ? console.warn(sQuote(reporter) + ' reporter not found')
              : console.warn(
                  sQuote(reporter) +
                    ' reporter blew up with error:\n' +
                    err.stack
                );
          }
        } else {
          console.warn(
            sQuote(reporter) + ' reporter blew up with error:\n' + err.stack
          );
        }
      }
    }
    if (!_reporter) {
      throw createInvalidReporterError(
        'invalid reporter ' + sQuote(reporter),
        reporter
      );
    }
    this._reporter = _reporter;
  }
  this.options.reporterOptions = reporterOptions;
  return this;
};

/**
 * Sets test UI `name`, defaults to "bdd".
 *
 * @public
 * @see {@link https://mochajs.org/#-u---ui-name|CLI option}
 * @see {@link https://mochajs.org/#interfaces|Interface DSLs}
 * @param {string|Function} [ui=bdd] - Interface name or class.
 * @returns {Mocha} this
 * @chainable
 * @throws {Error} if requested interface cannot be loaded
 */
Mocha.prototype.ui = function(ui) {
  var bindInterface;
  if (typeof ui === 'function') {
    bindInterface = ui;
  } else {
    ui = ui || 'bdd';
    bindInterface = exports.interfaces[ui];
    if (!bindInterface) {
      try {
        bindInterface = require(ui);
      } catch (err) {
        throw createInvalidInterfaceError(
          'invalid interface ' + sQuote(ui),
          ui
        );
      }
    }
  }
  bindInterface(this.suite);

  this.suite.on(EVENT_FILE_PRE_REQUIRE, function(context) {
    exports.afterEach = context.afterEach || context.teardown;
    exports.after = context.after || context.suiteTeardown;
    exports.beforeEach = context.beforeEach || context.setup;
    exports.before = context.before || context.suiteSetup;
    exports.describe = context.describe || context.suite;
    exports.it = context.it || context.test;
    exports.xit = context.xit || (context.test && context.test.skip);
    exports.setup = context.setup || context.beforeEach;
    exports.suiteSetup = context.suiteSetup || context.before;
    exports.suiteTeardown = context.suiteTeardown || context.after;
    exports.suite = context.suite || context.describe;
    exports.teardown = context.teardown || context.afterEach;
    exports.test = context.test || context.it;
    exports.run = context.run;
  });

  return this;
};

/**
 * Loads `files` prior to execution.
 *
 * @description
 * The implementation relies on Node's `require` to execute
 * the test interface functions and will be subject to its cache.
 *
 * @private
 * @see {@link Mocha#addFile}
 * @see {@link Mocha#run}
 * @see {@link Mocha#unloadFiles}
 * @param {Function} [fn] - Callback invoked upon completion.
 */
Mocha.prototype.loadFiles = function(fn) {
  var self = this;
  var suite = this.suite;
  this.files.forEach(function(file) {
    file = path.resolve(file);
    suite.emit(EVENT_FILE_PRE_REQUIRE, global, file, self);
    suite.emit(EVENT_FILE_REQUIRE, require(file), file, self);
    suite.emit(EVENT_FILE_POST_REQUIRE, global, file, self);
  });
  fn && fn();
};

/**
 * Removes a previously loaded file from Node's `require` cache.
 *
 * @private
 * @static
 * @see {@link Mocha#unloadFiles}
 * @param {string} file - Pathname of file to be unloaded.
 */
Mocha.unloadFile = function(file) {
  delete require.cache[require.resolve(file)];
};

/**
 * Unloads `files` from Node's `require` cache.
 *
 * @description
 * This allows files to be "freshly" reloaded, providing the ability
 * to reuse a Mocha instance programmatically.
 *
 * <strong>Intended for consumers &mdash; not used internally</strong>
 *
 * @public
 * @see {@link Mocha.unloadFile}
 * @see {@link Mocha#loadFiles}
 * @see {@link Mocha#run}
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.unloadFiles = function() {
  this.files.forEach(Mocha.unloadFile);
  return this;
};

/**
 * Sets `grep` filter after escaping RegExp special characters.
 *
 * @public
 * @see {@link Mocha#grep}
 * @param {string} str - Value to be converted to a regexp.
 * @returns {Mocha} this
 * @chainable
 * @example
 *
 * // Select tests whose full title begins with `"foo"` followed by a period
 * mocha.fgrep('foo.');
 */
Mocha.prototype.fgrep = function(str) {
  if (!str) {
    return this;
  }
  return this.grep(new RegExp(escapeRe(str)));
};

/**
 * @summary
 * Sets `grep` filter used to select specific tests for execution.
 *
 * @description
 * If `re` is a regexp-like string, it will be converted to regexp.
 * The regexp is tested against the full title of each test (i.e., the
 * name of the test preceded by titles of each its ancestral suites).
 * As such, using an <em>exact-match</em> fixed pattern against the
 * test name itself will not yield any matches.
 * <br>
 * <strong>Previous filter value will be overwritten on each call!</strong>
 *
 * @public
 * @see {@link https://mochajs.org/#-g---grep-pattern|CLI option}
 * @see {@link Mocha#fgrep}
 * @see {@link Mocha#invert}
 * @param {RegExp|String} re - Regular expression used to select tests.
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Select tests whose full title contains `"match"`, ignoring case
 * mocha.grep(/match/i);
 * @example
 *
 * // Same as above but with regexp-like string argument
 * mocha.grep('/match/i');
 * @example
 *
 * // ## Anti-example
 * // Given embedded test `it('only-this-test')`...
 * mocha.grep('/^only-this-test$/');    // NO! Use `.only()` to do this!
 */
Mocha.prototype.grep = function(re) {
  if (utils.isString(re)) {
    // extract args if it's regex-like, i.e: [string, pattern, flag]
    var arg = re.match(/^\/(.*)\/(g|i|)$|.*/);
    this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
  } else {
    this.options.grep = re;
  }
  return this;
};

/**
 * Inverts `grep` matches.
 *
 * @public
 * @see {@link Mocha#grep}
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Select tests whose full title does *not* contain `"match"`, ignoring case
 * mocha.grep(/match/i).invert();
 */
Mocha.prototype.invert = function() {
  this.options.invert = true;
  return this;
};

/**
 * Enables or disables ignoring global leaks.
 *
 * @public
 * @see {@link Mocha#checkLeaks}
 * @param {boolean} ignoreLeaks - Whether to ignore global leaks.
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Ignore global leaks
 * mocha.ignoreLeaks(true);
 */
Mocha.prototype.ignoreLeaks = function(ignoreLeaks) {
  this.options.ignoreLeaks = Boolean(ignoreLeaks);
  return this;
};

/**
 * Enables checking for global variables leaked while running tests.
 *
 * @public
 * @see {@link https://mochajs.org/#--check-leaks|CLI option}
 * @see {@link Mocha#ignoreLeaks}
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.checkLeaks = function() {
  this.options.ignoreLeaks = false;
  return this;
};

/**
 * Displays full stack trace upon test failure.
 *
 * @public
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.fullTrace = function() {
  this.options.fullStackTrace = true;
  return this;
};

/**
 * Enables desktop notification support if prerequisite software installed.
 *
 * @public
 * @see {@link Mocha#isGrowlCapable}
 * @see {@link Mocha#_growl}
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.growl = function() {
  this.options.growl = this.isGrowlCapable();
  if (!this.options.growl) {
    var detail = process.browser
      ? 'notification support not available in this browser...'
      : 'notification support prerequisites not installed...';
    console.error(detail + ' cannot enable!');
  }
  return this;
};

/**
 * @summary
 * Determines if Growl support seems likely.
 *
 * @description
 * <strong>Not available when run in browser.</strong>
 *
 * @private
 * @see {@link Growl#isCapable}
 * @see {@link Mocha#growl}
 * @return {boolean} whether Growl support can be expected
 */
Mocha.prototype.isGrowlCapable = growl.isCapable;

/**
 * Implements desktop notifications using a pseudo-reporter.
 *
 * @private
 * @see {@link Mocha#growl}
 * @see {@link Growl#notify}
 * @param {Runner} runner - Runner instance.
 */
Mocha.prototype._growl = growl.notify;

/**
 * Specifies whitelist of variable names to be expected in global scope.
 *
 * @public
 * @see {@link https://mochajs.org/#--globals-names|CLI option}
 * @see {@link Mocha#checkLeaks}
 * @param {String[]|String} globals - Accepted global variable name(s).
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Specify variables to be expected in global scope
 * mocha.globals(['jQuery', 'MyLib']);
 */
Mocha.prototype.globals = function(globals) {
  this.options.globals = (this.options.globals || [])
    .concat(globals)
    .filter(Boolean);
  return this;
};

/**
 * Enables or disables TTY color output by screen-oriented reporters.
 *
 * @public
 * @param {boolean} colors - Whether to enable color output.
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.useColors = function(colors) {
  if (colors !== undefined) {
    this.options.useColors = colors;
  }
  return this;
};

/**
 * Determines if reporter should use inline diffs (rather than +/-)
 * in test failure output.
 *
 * @public
 * @param {boolean} inlineDiffs - Whether to use inline diffs.
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.useInlineDiffs = function(inlineDiffs) {
  this.options.useInlineDiffs = inlineDiffs !== undefined && inlineDiffs;
  return this;
};

/**
 * Determines if reporter should include diffs in test failure output.
 *
 * @public
 * @param {boolean} hideDiff - Whether to hide diffs.
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.hideDiff = function(hideDiff) {
  this.options.hideDiff = hideDiff !== undefined && hideDiff;
  return this;
};

/**
 * @summary
 * Sets timeout threshold value.
 *
 * @description
 * A string argument can use shorthand (such as "2s") and will be converted.
 * If the value is `0`, timeouts will be disabled.
 *
 * @public
 * @see {@link https://mochajs.org/#-t---timeout-ms|CLI option}
 * @see {@link https://mochajs.org/#--no-timeouts|CLI option}
 * @see {@link https://mochajs.org/#timeouts|Timeouts}
 * @see {@link Mocha#enableTimeouts}
 * @param {number|string} msecs - Timeout threshold value.
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Sets timeout to one second
 * mocha.timeout(1000);
 * @example
 *
 * // Same as above but using string argument
 * mocha.timeout('1s');
 */
Mocha.prototype.timeout = function(msecs) {
  this.suite.timeout(msecs);
  return this;
};

/**
 * Sets the number of times to retry failed tests.
 *
 * @public
 * @see {@link https://mochajs.org/#retry-tests|Retry Tests}
 * @param {number} retry - Number of times to retry failed tests.
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Allow any failed test to retry one more time
 * mocha.retries(1);
 */
Mocha.prototype.retries = function(n) {
  this.suite.retries(n);
  return this;
};

/**
 * Sets slowness threshold value.
 *
 * @public
 * @see {@link https://mochajs.org/#-s---slow-ms|CLI option}
 * @param {number} msecs - Slowness threshold value.
 * @return {Mocha} this
 * @chainable
 * @example
 *
 * // Sets "slow" threshold to half a second
 * mocha.slow(500);
 * @example
 *
 * // Same as above but using string argument
 * mocha.slow('0.5s');
 */
Mocha.prototype.slow = function(msecs) {
  this.suite.slow(msecs);
  return this;
};

/**
 * Enables or disables timeouts.
 *
 * @public
 * @see {@link https://mochajs.org/#-t---timeout-ms|CLI option}
 * @see {@link https://mochajs.org/#--no-timeouts|CLI option}
 * @param {boolean} enableTimeouts - Whether to enable timeouts.
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.enableTimeouts = function(enableTimeouts) {
  this.suite.enableTimeouts(
    arguments.length && enableTimeouts !== undefined ? enableTimeouts : true
  );
  return this;
};

/**
 * Forces all tests to either accept a `done` callback or return a promise.
 *
 * @public
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.asyncOnly = function() {
  this.options.asyncOnly = true;
  return this;
};

/**
 * Disables syntax highlighting (in browser).
 *
 * @public
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.noHighlighting = function() {
  this.options.noHighlighting = true;
  return this;
};

/**
 * Enables uncaught errors to propagate (in browser).
 *
 * @public
 * @return {Mocha} this
 * @chainable
 */
Mocha.prototype.allowUncaught = function() {
  this.options.allowUncaught = true;
  return this;
};

/**
 * @summary
 * Delays root suite execution.
 *
 * @description
 * Used to perform asynch operations before any suites are run.
 *
 * @public
 * @see {@link https://mochajs.org/#delayed-root-suite|delayed root suite}
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.delay = function delay() {
  this.options.delay = true;
  return this;
};

/**
 * Causes tests marked `only` to fail the suite.
 *
 * @public
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.forbidOnly = function() {
  this.options.forbidOnly = true;
  return this;
};

/**
 * Causes pending tests and tests marked `skip` to fail the suite.
 *
 * @public
 * @returns {Mocha} this
 * @chainable
 */
Mocha.prototype.forbidPending = function() {
  this.options.forbidPending = true;
  return this;
};

/**
 * Mocha version as specified by "package.json".
 *
 * @name Mocha#version
 * @type string
 * @readonly
 */
Object.defineProperty(Mocha.prototype, 'version', {
  value: require('../package.json').version,
  configurable: false,
  enumerable: true,
  writable: false
});

/**
 * Callback to be invoked when test execution is complete.
 *
 * @callback DoneCB
 * @param {number} failures - Number of failures that occurred.
 */

/**
 * Runs root suite and invokes `fn()` when complete.
 *
 * @description
 * To run tests multiple times (or to run tests in files that are
 * already in the `require` cache), make sure to clear them from
 * the cache first!
 *
 * @public
 * @see {@link Mocha#loadFiles}
 * @see {@link Mocha#unloadFiles}
 * @see {@link Runner#run}
 * @param {DoneCB} [fn] - Callback invoked when test execution completed.
 * @return {Runner} runner instance
 */
Mocha.prototype.run = function(fn) {
  if (this.files.length) {
    this.loadFiles();
  }
  var suite = this.suite;
  var options = this.options;
  options.files = this.files;
  var runner = new exports.Runner(suite, options.delay);
  createStatsCollector(runner);
  var reporter = new this._reporter(runner, options);
  runner.ignoreLeaks = options.ignoreLeaks !== false;
  runner.fullStackTrace = options.fullStackTrace;
  runner.asyncOnly = options.asyncOnly;
  runner.allowUncaught = options.allowUncaught;
  runner.forbidOnly = options.forbidOnly;
  runner.forbidPending = options.forbidPending;
  if (options.grep) {
    runner.grep(options.grep, options.invert);
  }
  if (options.globals) {
    runner.globals(options.globals);
  }
  if (options.growl) {
    this._growl(runner);
  }
  if (options.useColors !== undefined) {
    exports.reporters.Base.useColors = options.useColors;
  }
  exports.reporters.Base.inlineDiffs = options.useInlineDiffs;
  exports.reporters.Base.hideDiff = options.hideDiff;

  function done(failures) {
    fn = fn || utils.noop;
    if (reporter.done) {
      reporter.done(failures, fn);
    } else {
      fn(failures);
    }
  }

  return runner.run(done);
};
