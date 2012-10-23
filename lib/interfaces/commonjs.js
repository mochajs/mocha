
/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test')
  , utils = require('../utils');

var assert;
try {
  assert = require('assert')
} catch(err) {
  // This is probably in the browser, which does not have a native assertion
  // module. Consider implementing one, but for now we just ignore this so
  // it only fails when the UI is CommonJS and reporting is browser.
}

var hasTests = function(object) {
  utils.keys(root)
}

/**
 * CommonJS-style interface:
 *
 *      exports['test Array'] = {}
 *      exports['test Array']['test #indexOf() should return -1 when not present'] = function(assert, done) {
 *      
 *      }
 *      exports['test Array']['test #indexOf() should return the index when present'] = function(assert, done) {
 *      
 *      }
 */

module.exports = function(suite){
  var suites = [suite];

  // Helper for collecting a nested object of tests into Mocha suites and tests.
  var collect = function(root, suiteName) {
    var didStartSuite = false;
    var ensureSuiteStarted = function() {
      if (!didStartSuite && suiteName) {
        didStartSuite = true;
        var suite = Suite.create(suites[0], suiteName);
        suites.unshift(suite);
      }
    };
    var ensureSuiteEnded = function() {
      if (didStartSuite) {
         suites.shift();
      }
    };

    // Collect only the attributes that start with "test".
    try {
      utils.keys(root).forEach(function(key) {
        var value = root[key];
        var matches = /^test(?:\_\.\-)?\s*(.*)/i.exec(key);
        if (matches) {
          ensureSuiteStarted();
          var title = matches[1];

          // If the test attribute is a function, treat it as a test
          // and then recurse through any children that might be sub-tests.
          if (typeof value === 'function') {
            var test

            // For synchronous tests, just give assert.
            if (value.length === 1) {
              test = new Test(title, function() {
                value(assert);
              });

            // For all other tests, treat them as asynchronous and give assert
            // and a done callback to indicate completion.
            } else {
              test = new Test(title, function(done) {
                value(assert, done)
              });
            }

            suites[0].addTest(test);
            collect(value, title);

          // Otherwise, just recurse and add sub-tests for nested objects.
          } else if (typeof value === 'object') {
            collect(value, title);
          }

        }
      });

    } finally {
      ensureSuiteEnded();
    }

  };

  suite.on('pre-require', function(context, file, mocha) {
    // If there are no files to test, use the `context` itself as the test root.
    // This is useful for browser tests (just set window.test to be the root
    // of all the tests that need to be run).
    if (mocha.files.length === 0) {
      collect(context)
    }
  });

  suite.on('require', function(obj, file, mocha){
    // If there are files to test, then `obj` will be the test root.
    if (mocha.files.length > 0) {
      collect(obj);
    }
  });

};
