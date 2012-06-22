
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

  suite.on('pre-require', function(context){

    // noop variants

    context.xdescribe = function(title, fn){
      var suite = Suite.create(suites[0], title)
        , addTest = suite.addTest
        , addSuite = suite.addSuite
      suite.addTest = fakeAddTest;
      suite.addSuite = fakeAddSuite;

      suites.unshift(suite);
      fn();
      suites.shift();

      function fakeAddTest(test) {
        test.pending = true;
        addTest.call(this, test);
      };
      // Turns the suite into a xdescribe suite
      function fakeAddSuite(suite) {
        suite.addTest = fakeAddTest;
        suite.addSuite = fakeAddSuite;
        addSuite.call(this, suite);
      };
    };

    context.xit = function(title){
      context.it(title);
    };

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};
