'use strict';

var Mocha = require('../../../lib/mocha');
var Test = Mocha.Test;
var EVENT_FILE_PRE_REQUIRE = Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE;

/**
 * A simple UI that only exposes a single function: test
 */
module.exports = Mocha.interfaces['simple-ui'] = function(suite) {
  suite.on(EVENT_FILE_PRE_REQUIRE, function(
    context,
    file,
    mocha
  ) {
    var common = require('../../../lib/interfaces/common')(
      [suite],
      context
    );

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Describes a specification or test-case with the given `title`
     * and callback `fn` acting as a thunk.
     */
    context.test = function(title, fn) {
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);

      return test;
    };
  });
};
