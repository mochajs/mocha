'use strict';
const Suite = require('../suite');
const Test = require('../test');

/**
 * Exports-style (as Node.js module) interface:
 *
 *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function() {
 *
 *         },
 *
 *         'should return the correct index when the value is present': function() {
 *
 *         }
 *       }
 *     };
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function (suite) {
  const suites = [suite];

  suite.on(Suite.constants.EVENT_FILE_REQUIRE, visit);

  function visit(obj, file) {
    let suite;
    for (const key in obj) {
      if (typeof obj[key] === 'function') {
        const fn = obj[key];
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
            var test = new Test(key, fn);
            test.file = file;
            suites[0].addTest(test);
        }
      } else {
        suite = Suite.create(suites[0], key);
        suites.unshift(suite);
        visit(obj[key], file);
        suites.shift();
      }
    }
  }
};

module.exports.description = 'Node.js module ("exports") style';
