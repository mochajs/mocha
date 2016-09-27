/**
 * Module dependencies.
 */

var Test = require('../test');

/**
 * BDD-style interface:
 *
 *      describe('Array', function() {
 *        describe('#indexOf()', function() {
 *          it('should return -1 when not present', function() {
 *            // ...
 *          });
 *
 *          it('should return the index when present', function() {
 *            // ...
 *          });
 *        });
 *      });
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function(suite) {
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha) {
    var common = require('./common')(suites, context, mocha);

    context.before = common.before;
    context.after = common.after;
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.run = mocha.options.delay && common.runWithSuite(suite);
    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.describe = context.context = function(title, fn) {
      return common.suite.create({
        title: title,
        file: file,
        fn: fn
      });
    };

    /**
     * Pending describe.
     */

    context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
      return common.suite.skip({
        title: title,
        file: file,
        fn: fn
      });
    };

    /**
     * Run tests "in order"; do not randomize.
     */
    context.describe.inOrder = function func(title, fn) {
      var suite = context.describe(title, fn);
      suite.randomized(false);
      return suite;
    };
    // these three are disabled anyway, so don't actually implement inOrder
    context.describe.inOrder.skip = context.describe.skip.inOrder
      = context.xdescribe.inOrder = context.describe.skip;

    /**
     * Exclusive suite.
     */
    context.describe.only = function(title, fn) {
      return common.suite.only({
        title: title,
        file: file,
        fn: fn
      });
    };
    context.describe.only.inOrder = context.describe.inOrder.only
      = function(title, fn) {
        var suite = context.describe.inOrder(title, fn);
        mocha.grep(suite.fullTitle());
        return suite;
      };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn) {
      var suite = suites[0];
      if (suite.isPending()) {
        fn = null;
      }
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.it.only = function(title, fn) {
      return common.test.only(mocha, context.it(title, fn));
    };

    /**
     * Pending test case.
     */

    context.xit = context.xspecify = context.it.skip = function(title) {
      context.it(title);
    };

    /**
     * Number of attempts to retry.
     */
    context.it.retries = function(n) {
      context.retries(n);
    };
  });
};
