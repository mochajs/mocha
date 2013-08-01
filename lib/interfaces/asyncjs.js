
/**
 * Module dependencies.
 */

var Test = require('../test');

/**
 * AsyncJS-style interface:
 *
 *     module.exports = {
 *
 *      setUp: function(next) {
 *        [...]
 *      },
 *
 *      tearDownSuite: function (next) {
 *        [...]
 *      },
 *
 *      test get all user keys : function(next) {
 *        [...]
 *      },
 *
 *      test get single user : function(next) {
 *        [...]
 *      }
 *
 *    };
 *
 */

var RE_RUNONE = /^[\s]*>[\s]*(test.*)$/i;
var RE_ISTEST = /^[\s]*test.*$/i;

module.exports = function(suite){
  suite.timeout(3000);

  suite.on('require', function(obj) {
    var key, match, hasRunOne, test;
    // AsyncJS has a default timeout of 3000ms
    // a timeout can also be defined inside a suite:
    var timeout = typeof obj.timeout == 'number' ? obj.timeout : 3000;
    suite.title = typeof obj.name == 'string' ? obj.name : 'AsyncJS testcase';

    // set the timeout for async tests
    suite.timeout(timeout);

    // use the first loop to check if there is a test that is supposed to be the
    // only one to be run
    for (key in obj) {
      if ('function' == typeof obj[key] && (match = key.match(RE_RUNONE))) {
        suite.addTest(new Test(match[1], obj[key]));
        hasRunOne = true;
        break;
      }
    }

    for (key in obj) {
      if ('function' == typeof obj[key]) {
        var fn = obj[key];
        // keep setting the damn timeout of the suite, because of timing issues
        // when running mocha from the command line
        //suite.timeout(timeout);
        switch (key) {
          case 'setUpSuite':
            suite.beforeAll(fn);
            break;
          case 'tearDownSuite':
            suite.afterAll(fn);
            break;
          case 'setUp':
            suite.beforeEach(fn);
            break;
          case 'tearDown':
            suite.afterEach(fn);
            break;
          default:
              suite.addTest(new Test(key, fn));
            else
              suite.ctx[key] = fn;
        }
      }
    }
  });
};
