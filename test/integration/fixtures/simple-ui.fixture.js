
import { Mocha } from "../../../lib/mocha.js";
import { commonInterface } from '../../../lib/interfaces/common.js';

var Test = Mocha.Test;
var EVENT_FILE_PRE_REQUIRE = Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE;

/**
 * A simple UI that only exposes a single function: test
 */
function SimpleUi(suite) {
  suite.on(EVENT_FILE_PRE_REQUIRE, function (
    context,
    file,
    mocha
  ) {
    var common = commonInterface(
      [suite],
      context
    );

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Describes a specification or test-case with the given `title`
     * and callback `fn` acting as a thunk.
     */
    context.test = function (title, fn) {
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);

      return test;
    };
  });
};

Mocha.interfaces['simple-ui'] = SimpleUi;

export default SimpleUi;
