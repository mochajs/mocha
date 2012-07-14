
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

    // pending variants

    context.xdescribe = context.xcontext = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn();
      suites.shift();
    };
    context.xit = context.xspecify = function(title){
      context.it(title);
    };

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      if (!suites[0].pending) {
        suites[0].beforeAll(fn);
      }
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      if (!suites[0].pending) {
        suites[0].afterAll(fn);
      }
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      if (!suites[0].pending) {
        suites[0].beforeEach(fn);
      }
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      if (!suites[0].pending) {
        suites[0].afterEach(fn);
      }
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
      if (suites[0].pending) var fn = undefined;
      suites[0].addTest(new Test(title, fn));
    };
  });
};
