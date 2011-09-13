
/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 * 
 *      suite('Array', function(){
 *        suite('#indexOf()', function(){
 *          test('should return -1 when not present', function(){
 *
 *          });
 *   
 *          test('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context, file){

    /**
     * Execute before each test case.
     */

    context.setup = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute before each test case.
     */

    context.tearDown = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
    
    context.suite = function(title, fn){
      var suite = suite = new Suite(title);
      suites[0].addSuite(suite);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};
