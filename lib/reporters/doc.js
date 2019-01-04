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
 * Initialize a new `Doc` reporter.
 *
 * @class
 * @memberof Mocha.reporters
 * @extends {Base}
 * @public
 * @param {Runner} runner
 */
function Doc(runner) {
  Base.call(this, runner);

  var indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on(EVENT_SUITE_BEGIN, function(suite) {
    if (suite.root) {
      return;
    }
    ++indents;
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    console.log('%s<dl>', indent());
  });

  runner.on(EVENT_SUITE_END, function(suite) {
    if (suite.root) {
      return;
    }
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on(EVENT_TEST_PASS, function(test) {
    console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.body));
    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on(EVENT_TEST_FAIL, function(test, err) {
    console.log(
      '%s  <dt class="error">%s</dt>',
      indent(),
      utils.escape(test.title)
    );
    var code = utils.escape(utils.clean(test.body));
    console.log(
      '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
      indent(),
      code
    );
    console.log('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
  });
}

Doc.description = 'HTML documentation';
