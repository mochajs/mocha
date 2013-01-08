
/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test')
  , assert = require("assert");

/**
 * QUnit-style interface:
 * 
 *     suite('Array');
 *     
 *     test('#length', function(){
 *       var arr = [1,2,3];
 *       ok(arr.length == 3);
 *     });
 *     
 *     test('#indexOf()', function(){
 *       var arr = [1,2,3];
 *       ok(arr.indexOf(1) == 0);
 *       ok(arr.indexOf(2) == 1);
 *       ok(arr.indexOf(3) == 2);
 *     });
 *     
 *     suite('String');
 *     
 *     test('#length', function(){
 *       ok('foo'.length == 3);
 *     });
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  var assertionCount;
  var expectedAssertions;

  suite.on('pre-require', function(context){

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
     * Describe a "suite" with the given `title`.
     */
  
    context.suite = function(title){
      if (suites.length > 1) suites.shift();
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
    };

    /** 
    * Call this after each assertion to increment the assertion count 
    * (for custom assertion types)
    */
    context.afterAssertion = function (){
      assertionCount++;
    };

    /** The number of assertions to expect in the current test case */
    context.expect = function (n){
      expectedAssertions = n;
    };

    /** Define all of the QUnit Assertions based of their node.js equivalents */
    ["deepEqual", "equal", "notDeepEqual", "notEqual",
     "notStrictEqual","ok","strictEqual","throws"].forEach(function (k){
      context[k] = function (){
        assertionCount++;
        assert[k].apply(null, arguments);
      }
    });

    /** 
    * Checks to see if the assertion counts indicate a failure.  
    * Returns an Error object if it did, null otherwise;
    */
    var checkAssertionCount = function (){
      if(expectedAssertions > 0 && expectedAssertions != assertionCount){
        return new Error("Expected "+ expectedAssertions + " assertions but saw " + assertionCount);
      };
      return null;
    };

    /**
     * Describe a specification or test-case
     * with the given `title`, an optional number of assertions to expect,
     * callback `fn` acting as a thunk.
     */
    context.test = function(title, expect, fn){
      if(typeof expect == "function"){
        fn = expect;
        expect = 0
      }
      var newFn;
      if(fn.length){
        newFn = function (done){
          expectedAssertions = expect;
          assertionCount = 0;
          var newDone = function (err){
            done(err || checkAssertionCount())
          };
          fn(newDone);
        }
      }else{
        newFn = function (){
          expectedAssertions = expect;
          assertionCount = 0;
          fn();
          var countError= checkAssertionCount();
          if(countError){
            throw countError;
          }
        }
      }
      suites[0].addTest(new Test(title, newFn));
    };
  });
};
