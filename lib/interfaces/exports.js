
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

  suite.on('require', visit);

  function visit(obj) {
    var suite;
    for (var key in obj) {
      if ('function' == typeof obj[key]) {
        suites[0].addTest(new Test(key, obj[key]));
      } else {
        suites[0].addSuite(suite = new Suite(key));
        suites.unshift(suite);
        visit(obj[key]);
        suites.shift();
      }
    }
  }
};