'use strict';
/**
 * @module Doc
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const utils = require('../utils');
const constants = require('../runner').constants;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
const EVENT_SUITE_END = constants.EVENT_SUITE_END;

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

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

  let indents = 2;

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
    const code = utils.escape(utils.clean(test.body));
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
    const code = utils.escape(utils.clean(test.body));
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

Doc.description = 'HTML documentation';
