var Mocha = require('mocha');
    Suite = require('mocha/lib/suite'),
    Test  = require('mocha/lib/test');

/**
 * A simple UI that only exposes a single function: test
 */
module.exports = Mocha.interfaces['simple-ui'] = function(suite) {
  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')([suite], context);

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