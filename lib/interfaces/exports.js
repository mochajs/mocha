
/**
 * Module dependencies.
 */
var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 *
 *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function(){
 *
 *         },
 *
 *         'should return the correct index when the value is present': function(){
 *
 *         }
 *       }
 *     };
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('require', visit);

  function visit(obj) {
    var suite;
    for (var key in obj) {
      var fn = obj[key];
      switch(typeof fn) {
        case 'function': 
          switch (key) {
            case 'before':
              suites[0].beforeAll(fn);
              break;
            case 'after':
              suites[0].afterAll(fn);
              break;
            case 'beforeEach':
              suites[0].beforeEach(fn);
              break;
            case 'afterEach':
              suites[0].afterEach(fn);
              break;
            default:
              suites[0].addTest(new Test(key, fn));
          };
          break;
        case 'boolean':
        case 'number':
        case 'string':
          switch(key) {
            case 'timeout': 
              suites[0].timeout(fn);
              if (isNaN(suites[0]._timeout)) 
                  throw new Error("wrong format in timeout specification: " + fn );
              continue;
            //TRICKY: no case default on purpose - results in 
            //        case sliding of outer switch
          }
        default:
          var suite = Suite.create(suites[0], key);
          suites.unshift(suite);
          visit(obj[key]);
          suites.shift();
      }
    }
  }
};
