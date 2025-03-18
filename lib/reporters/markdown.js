'use strict';
/**
 * @module Markdown
 */
/**
 * Module dependencies.
 */

const Base = require('./base');
const utils = require('../utils');
const constants = require('../runner').constants;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
const EVENT_SUITE_END = constants.EVENT_SUITE_END;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;

/**
 * Constants
 */

const SUITE_PREFIX = '$';

/**
 * Expose `Markdown`.
 */

exports = module.exports = Markdown;

/**
 * Constructs a new `Markdown` reporter instance.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner - Instance triggers reporter actions.
 * @param {Object} [options] - runner options
 */
function Markdown(runner, options) {
  Base.call(this, runner, options);

  let level = 0;
  let buf = '';

  function title(str) {
    return Array(level).join('#') + ' ' + str;
  }

  function mapTOC(suite, obj) {
    const ret = obj;
    const key = SUITE_PREFIX + suite.title;

    obj = obj[key] = obj[key] || {suite};
    suite.suites.forEach(function (suite) {
      mapTOC(suite, obj);
    });

    return ret;
  }

  function stringifyTOC(obj, level) {
    ++level;
    let buf = '';
    let link;
    for (const key in obj) {
      if (key === 'suite') {
        continue;
      }
      if (key !== SUITE_PREFIX) {
        link = ' - [' + key.substring(1) + ']';
        link += '(#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
        buf += Array(level).join('  ') + link;
      }
      buf += stringifyTOC(obj[key], level);
    }
    return buf;
  }

  function generateTOC(suite) {
    const obj = mapTOC(suite, {});
    return stringifyTOC(obj, 0);
  }

  generateTOC(runner.suite);

  runner.on(EVENT_SUITE_BEGIN, function (suite) {
    ++level;
    const slug = utils.slug(suite.fullTitle());
    buf += '<a name="' + slug + '"></a>' + '\n';
    buf += title(suite.title) + '\n';
  });

  runner.on(EVENT_SUITE_END, function () {
    --level;
  });

  runner.on(EVENT_TEST_PASS, function (test) {
    const code = utils.clean(test.body);
    buf += test.title + '.\n';
    buf += '\n```js\n';
    buf += code + '\n';
    buf += '```\n\n';
  });

  runner.once(EVENT_RUN_END, function () {
    process.stdout.write('# TOC\n');
    process.stdout.write(generateTOC(runner.suite));
    process.stdout.write(buf);
  });
}

Markdown.description = 'GitHub Flavored Markdown';
