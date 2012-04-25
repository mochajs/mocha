
/*!
 * mocha
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path');

/**
 * Expose `Mocha`.
 */

exports = module.exports = Mocha;

/**
 * Library version.
 */

exports.version = '1.0.2';

/**
 * Expose internals.
 */

exports.utils = require('./utils');
exports.interfaces = require('./interfaces');
exports.reporters = require('./reporters');
exports.Runnable = require('./runnable');
exports.Context = require('./context');
exports.Runner = require('./runner');
exports.Suite = require('./suite');
exports.Hook = require('./hook');
exports.Test = require('./test');

/**
 * Return image `name` path.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function image(name) {
  return __dirname + '/../images/' + name + '.png';
}

/**
 * Setup mocha with `options`.
 *
 * Options:
 *
 *   - `ui` name "bdd", "tdd", "exports" etc
 *   - `reporter` reporter instance, defaults to `mocha.reporters.Dot`
 *   - `globals` array of accepted globals
 *   - `timeout` timeout in milliseconds
 *   - `ignoreLeaks` ignore global leaks
 *
 * @param {Object} options
 * @api public
 */

function Mocha(options) {
  options = options || {};
  this.files = [];
  this.options = options;
  this.suite = new exports.Suite('', new exports.Context);
  this.ui(options.ui);
  this.reporter(options.reporter);
  if (options.timeout) this.suite.timeout(options.timeout);
}

/**
 * Add test `file`.
 *
 * @param {String} file
 * @api public
 */

Mocha.prototype.addFile = function(file){
  this.files.push(file);
  return this;
};

/**
 * Set reporter to `name`, defaults to "dot".
 *
 * @param {String} name
 * @api public
 */

Mocha.prototype.reporter = function(name){
  name = name || 'dot';
  this._reporter = require('./reporters/' + name);
  if (!this._reporter) throw new Error('invalid reporter "' + name + '"');
  return this;
};

/**
 * Set test UI `name`, defaults to "bdd".
 *
 * @param {String} bdd
 * @api public
 */

Mocha.prototype.ui = function(name){
  name = name || 'bdd';
  this._ui = exports.interfaces[name];
  if (!this._ui) throw new Error('invalid interface "' + name + '"');
  this._ui = this._ui(this.suite);
  return this;
};

/**
 * Load registered files.
 *
 * @api private
 */

Mocha.prototype.loadFiles = function(){
  var suite = this.suite;
  this.files.forEach(function(file){
    file = path.resolve(file);
    suite.emit('pre-require', global, file);
    suite.emit('require', require(file), file);
    suite.emit('post-require', global, file);
  });
};

/**
 * Enable growl support.
 *
 * @api private
 */

Mocha.prototype.growl = function(runner, reporter) {
  var notify = require('growl');

  runner.on('end', function(){
    var stats = reporter.stats;
    if (stats.failures) {
      var msg = stats.failures + ' of ' + runner.total + ' tests failed';
      notify(msg, { title: 'Failed', image: image('fail') });
    } else {
      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
          title: 'Passed'
        , image: image('pass')
      });
    }
  });
};

/**
 * Run tests and invoke `fn()` when complete.
 *
 * @param {Function} fn
 * @return {Runner}
 * @api public
 */

Mocha.prototype.run = function(fn){
  this.loadFiles();
  var suite = this.suite;
  var options = this.options;
  var runner = new exports.Runner(suite);
  var reporter = new this._reporter(runner);
  runner.ignoreLeaks = options.ignoreLeaks;
  if (options.grep) runner.grep(options.grep);
  if (options.globals) runner.globals(options.globals);
  if (options.growl) this.growl(runner, reporter);
  return runner.run(fn);
};
