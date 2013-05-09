
/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * BDD-style interface:
 *
 *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha){

    /**
     * Execute before running tests.
     *
     * @return {Hook} the beforeAll hook for chaining
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
      return suites[0]._beforeAll.slice(-1)[0];
    };

    /**
     * Execute after running tests.
     *
     * @return {Hook} the afterAll hook for chaining
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
      return suites[0]._afterAll.slice(-1)[0];
    };

    /**
     * Execute before each test case.
     *
     * @return {Hook} the beforeEach hook for chaining
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
      return suites[0]._beforeEach.slice(-1)[0];
    };

    /**
     * Execute after each test case.
     *
     * @return {Hook} the afterEach hook for chaining
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
      return suites[0]._afterEach.slice(-1)[0];
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };

    /**
     * Pending describe.
     */

    context.xdescribe =
    context.xcontext =
    context.describe.skip = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Exclusive suite.
     */

    context.describe.only = function(title, fn){
      var suite = context.describe(title, fn);
      mocha.grep(suite.fullTitle());
      return suite
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      var test = new Test(title, fn);
      suite.addTest(test);
      return test;
    };

    /**
     * Exclusive test-case.
     */

    context.it.only = function(title, fn){
      var test = context.it(title, fn);
      mocha.grep(test.fullTitle());
      return test
    };

    /**
     * Pending test case.
     */

    context.xit =
    context.xspecify =
    context.it.skip = function(title){
      context.it(title);
    };
  });
};
