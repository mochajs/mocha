import { Test } from "../test.js";
import { Suite } from "../suite.js";
import { createCommon } from "./common.js";

const EVENT_FILE_PRE_REQUIRE = Suite.constants.EVENT_FILE_PRE_REQUIRE;

/**
 * `require`-style interface.
 *
 * This interface avoids injecting globals into the runtime context. Instead,
 * test files import the DSL from `mocha`, allowing styles to be mixed within
 * the same file.
 *
 * @param {Suite} suite Root suite.
 */
function requireInterface(suite) {
  var suites = [suite];

  suite.on(EVENT_FILE_PRE_REQUIRE, function (context, file, mocha) {
    var common = createCommon(suites, context, mocha);

    context.before = common.before;
    context.after = common.after;
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.run = mocha.options.delay && common.runWithSuite(suite);

    context.describe = function (title, fn) {
      return common.suite.create({
        title,
        file,
        fn,
      });
    };

    context.describe.only = function (title, fn) {
      return common.suite.only({
        title,
        file,
        fn,
      });
    };

    context.describe.skip = function (title, fn) {
      return common.suite.skip({
        title,
        file,
        fn,
      });
    };

    context.context = context.describe;
    context.xdescribe = context.xcontext = context.describe.skip;

    context.it = function (title, fn) {
      var currentSuite = suites[0];
      if (currentSuite.isPending()) {
        fn = null;
      }
      var test = new Test(title, fn);
      test.file = file;
      currentSuite.addTest(test);
      return test;
    };

    context.it.only = function (title, fn) {
      return common.test.only(mocha, context.it(title, fn));
    };

    context.it.skip = function (title) {
      return context.it(title);
    };

    context.specify = context.it;
    context.xit = context.xspecify = context.it.skip;

    context.setup = context.beforeEach;
    context.teardown = context.afterEach;
    context.suiteSetup = context.before;
    context.suiteTeardown = context.after;

    context.suite = function (title, fn) {
      return common.suite.create({
        title,
        file,
        fn,
      });
    };

    context.suite.only = function (title, fn) {
      return common.suite.only({
        title,
        file,
        fn,
      });
    };

    context.suite.skip = function (title, fn) {
      return common.suite.skip({
        title,
        file,
        fn,
      });
    };

    context.test = function (title, fn) {
      return context.it(title, fn);
    };

    context.test.only = function (title, fn) {
      return common.test.only(mocha, context.test(title, fn));
    };

    context.test.skip = common.test.skip;
  });
}

requireInterface.description =
  "Require-style DSL without global variable injection";
requireInterface.requiresGlobalContext = false;

export { requireInterface };
