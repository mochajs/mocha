/**
 * @typedef {import('../runner.js').Runner} Runner
 */

/**
 * @module Markdown
 */
/**
 * Module dependencies.
 */

import { Base } from "./base.js";
import utils from "../utils.cjs";
import { Runner } from "../runner.js";
var constants = Runner.constants;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
var EVENT_SUITE_END = constants.EVENT_SUITE_END;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;

/**
 * Constants
 */

var SUITE_PREFIX = "$";

var MARKDOWN_SPECIAL_CHARACTERS = /([\\`*_{}[\]()#+\-.!<>|])/g;

/**
 * Backslash-escapes characters that have special meaning in markdown so that
 * titles are rendered literally.
 *
 * @private
 * @param {string} str - Raw title text.
 * @return {string} Escaped text safe for inline use in markdown.
 */
function escapeSpecialCharacters(str) {
  return str.replace(MARKDOWN_SPECIAL_CHARACTERS, "\\$1");
}

class Markdown extends Base {
  static description = "GitHub Flavored Markdown";

  /**
   * Constructs a new `Markdown` reporter instance.
   *
   * @public
   * @memberof Mocha.reporters
   * @extends Mocha.reporters.Base
   * @param {Runner} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options) {
    super(runner, options);

    var level = 0;
    var buf = "";

    var escapeTitle =
      options &&
      options.reporterOptions &&
      options.reporterOptions.escapeSpecialCharacters
        ? escapeSpecialCharacters
        : function (str) {
            return str;
          };

    function title(str) {
      return Array(level).join("#") + " " + escapeTitle(str);
    }

    function mapTOC(suite, obj) {
      var ret = obj;
      var key = SUITE_PREFIX + suite.title;

      obj = obj[key] = obj[key] || { suite };
      suite.suites.forEach(function (suite) {
        mapTOC(suite, obj);
      });

      return ret;
    }

    function stringifyTOC(obj, level) {
      ++level;
      var buf = "";
      var link;
      for (var key in obj) {
        if (key === "suite") {
          continue;
        }
        if (key !== SUITE_PREFIX) {
          link = " - [" + escapeTitle(key.substring(1)) + "]";
          link += "(#" + utils.slug(obj[key].suite.fullTitle()) + ")\n";
          buf += Array(level).join("  ") + link;
        }
        buf += stringifyTOC(obj[key], level);
      }
      return buf;
    }

    function generateTOC(suite) {
      var obj = mapTOC(suite, {});
      return stringifyTOC(obj, 0);
    }

    generateTOC(runner.suite);

    runner.on(EVENT_SUITE_BEGIN, function (suite) {
      ++level;
      var slug = utils.slug(suite.fullTitle());
      buf += '<a name="' + slug + '"></a>' + "\n";
      buf += title(suite.title) + "\n";
    });

    runner.on(EVENT_SUITE_END, function () {
      --level;
    });

    runner.on(EVENT_TEST_PASS, function (test) {
      var code = utils.clean(test.body);
      buf += escapeTitle(test.title) + ".\n";
      buf += "\n```js\n";
      buf += code + "\n";
      buf += "```\n\n";
    });

    runner.once(EVENT_RUN_END, function () {
      process.stdout.write("# TOC\n");
      process.stdout.write(generateTOC(runner.suite));
      process.stdout.write(buf);
    });
  }
}

export { Markdown };
