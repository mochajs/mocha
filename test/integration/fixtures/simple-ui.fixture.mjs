import Mocha from '../../../lib/mocha.js'
import MochaInterface from '../../../lib/interfaces/common.js';

const Test = Mocha.Test;
const EVENT_FILE_PRE_REQUIRE = Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE;

/**
 * A simple UI that only exposes a single function: test
 */
function SimpleUI(suite) {
  suite.on(EVENT_FILE_PRE_REQUIRE, function(
    context,
    file,
    mocha
  ) {
    const common = MochaInterface(
      [suite],
      context
    );

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Describes a specification or test-case with the given `title`
     * and callback `fn` acting as a thunk.
     */
    context.test = function(title, fn) {
      const test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);

      return test;
    };
  });
};

Mocha.interfaces['simple-ui'] = SimpleUI;

export default SimpleUI;
