'use strict';
/**
 * @module TAP
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function TAP(runner, options) {
  Base.call(this, runner);

  var self = this;
  var n = 1;

  var tapSpec = '12';
  if (options && options.reporterOptions) {
    if (options.reporterOptions.spec) {
      var tapSpec = options.reporterOptions.spec;
    }
  }

  if (tapSpec === '13') {
    this.producer = new TAP13Producer();
  } else {
    this.producer = new TAP12Producer();
  }

  runner.on('start', function() {
    self.producer.writeStart(runner);
  });

  runner.on('test end', function() {
    ++n;
  });

  runner.on('pending', function(test) {
    self.producer.writePending(n, test);
  });

  runner.on('pass', function(test) {
    self.producer.writePass(n, test);
  });

  runner.on('fail', function(test, err) {
    self.producer.writeFail(n, test, err);
  });

  runner.once('end', function() {
    self.producer.writeEnd(runner);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @api private
 * @param {Object} test
 * @return {String}
 */
function title(test) {
  return test.fullTitle().replace(/#/g, '');
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(TAP, Base);

/**
 * Initialize a new `TAPProducer`. Should only be used as a base class.
 *
 * @private
 * @class
 * @api private
 */
function TAPProducer() {}

TAPProducer.prototype.writePending = function(n, test) {
  console.log('ok %d %s # SKIP -', n, title(test));
};

TAPProducer.prototype.writePass = function(n, test) {
  console.log('ok %d %s', n, title(test));
};

TAPProducer.prototype.writeEnd = function(runner) {
  console.log('# tests ' + (runner.stats.passes + runner.stats.failures));
  console.log('# pass ' + runner.stats.passes);
  console.log('# fail ' + runner.stats.failures);
};

/**
 * Initialize a new `TAP12Producer` which will produce output conforming to the TAP12 spec.
 *
 * @private
 * @class
 * @api private
 */
function TAP12Producer() {}

TAP12Producer.prototype.writeStart = function(runner) {
  var total = runner.grepTotal(runner.suite);
  console.log('%d..%d', 1, total);
};

TAP12Producer.prototype.writeFail = function(n, test, err) {
  console.log('not ok %d %s', n, title(test));
  if (err.message) {
    console.log(err.message.replace(/^/gm, '  '));
  }
  if (err.stack) {
    console.log(err.stack.replace(/^/gm, '  '));
  }
};

inherits(TAP12Producer, TAPProducer);

/**
 * Initialize a new `TAP13Producer` which will produce output conforming to the TAP13 spec.
 *
 * @private
 * @class
 * @api private
 */
function TAP13Producer() {}

TAP13Producer.prototype.yamlIndent = function(level) {
  return Array(level + 1).join('  ');
};

TAP13Producer.prototype.writeStart = function(runner) {
  console.log('TAP version 13');
  var total = runner.grepTotal(runner.suite);
  console.log('%d..%d', 1, total);
};

TAP13Producer.prototype.writeFail = function(n, test, err) {
  console.log('not ok %d %s', n, title(test));
  var emitYamlBlock = err.message != null || err.stack != null;
  if (emitYamlBlock) {
    console.log(this.yamlIndent(1) + '---');
    if (err.message) {
      console.log(this.yamlIndent(2) + 'message: |-');
      console.log(err.message.replace(/^/gm, this.yamlIndent(3)));
    }
    if (err.stack) {
      console.log(this.yamlIndent(2) + 'stack: |-');
      console.log(err.stack.replace(/^/gm, this.yamlIndent(3)));
    }
    console.log(this.yamlIndent(1) + '...');
  }
};

inherits(TAP13Producer, TAPProducer);
