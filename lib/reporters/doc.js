'use strict';
/**
 * @module Doc
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var utils = require('../utils');
var constants = require('../runner').constants;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
var EVENT_SUITE_END = constants.EVENT_SUITE_END;

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Save log references to avoid tests interfering (see GH-3604).
 */
var println = console.log;

/**
 * Constructs a new `Doc` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Doc(runner, options) {
  Base.call(this, runner, options);

  var indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    if (suite.root) {
      return;
    }
    ++indents;
    println('%s<section class="suite">', indent());
    ++indents;
    println('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    println('%s<dl>', indent());
  });

  runner.on(EVENT_SUITE_END, function(suite) {
    if (suite.root) {
      return;
    }
    println('%s</dl>', indent());
    --indents;
    println('%s</section>', indent());
    --indents;
  });

  runner.on(EVENT_TEST_PASS, function(test) {
    println('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.body));
    println('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on(EVENT_TEST_FAIL, function(test, err) {
    println(
      '%s  <dt class="error">%s</dt>',
      indent(),
      utils.escape(test.title)
    );
    var code = utils.escape(utils.clean(test.body));
    println(
      '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
      indent(),
      code
    );
    println('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
  });
}

Doc.description = 'HTML documentation';
