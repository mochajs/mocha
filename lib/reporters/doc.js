'use strict';

/**
 * @typedef {import('../runner.js')} Runner
 */

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
 * Constructs a new `Doc` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 */
class Doc extends Base {
/**
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
constructor(runner, options) {
  super(runner, options);

  var indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on(EVENT_SUITE_BEGIN, function (suite) {
    if (suite.root) {
      return;
    }
    ++indents;
    Base.consoleLog('%s<section class="suite">', indent());
    ++indents;
    Base.consoleLog('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    Base.consoleLog('%s<dl>', indent());
  });

  runner.on(EVENT_SUITE_END, function (suite) {
    if (suite.root) {
      return;
    }
    Base.consoleLog('%s</dl>', indent());
    --indents;
    Base.consoleLog('%s</section>', indent());
    --indents;
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    Base.consoleLog('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    Base.consoleLog('%s  <dt>%s</dt>', indent(), utils.escape(test.file));
    var code = utils.escape(utils.clean(test.body));
    Base.consoleLog('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on(EVENT_TEST_FAIL, function (test, err) {
    Base.consoleLog(
      '%s  <dt class="error">%s</dt>',
      indent(),
      utils.escape(test.title)
    );
    Base.consoleLog(
      '%s  <dt class="error">%s</dt>',
      indent(),
      utils.escape(test.file)
    );
    var code = utils.escape(utils.clean(test.body));
    Base.consoleLog(
      '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
      indent(),
      code
    );
    Base.consoleLog(
      '%s  <dd class="error">%s</dd>',
      indent(),
      utils.escape(err)
    );
  });
}
}

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

Doc.description = 'HTML documentation';
