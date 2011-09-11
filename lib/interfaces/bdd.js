
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
    
  suite.on('pre-require', function(context, file){
  
  
    /**
     * Do this before each example
     *
     */
    context.beforeEach = function(fn){
      suites[0].addSetup(fn);
    };

    /**
     * Do this after each example
     *
     */
    context.afterEach = function(fn){
      suites[0].addTearDown(fn);
    };
    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = function(title, fn){
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

    context.it = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};
