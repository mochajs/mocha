'use strict';

/**
 * Module dependencies.
 */

var bdd = require('./bdd');

/**
 * ClassBDD-style interface:
 *
 *      class ArrayIndexOf {
 *
 *        itShouldReturnMinus1WhenNotPresent() {
 *          // ...
 *        }
 *
 *        itShouldReturnTheIndexWhenPresent() {
 *          // ...
 *        }
 *
 *      }
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function (suite) {
  bdd(suite);

  suite.on('pre-require', function (context, file, mocha) {
    suite.on('require', visit);

    var testMapping = [
      { match: /^itSkip.*$/, fn: context.it.skip },
      { match: /^xit.*$/, fn: context.it.skip },
      { match: /^itOnly.*$/, fn: context.it.only },
      { match: /^it.*$/, fn: context.it },
      { match: /^beforeEach.*$/, fn: function (_, fn) { context.beforeEach(fn); } },
      { match: /^afterEach.*$/, fn: function (_, fn) { context.afterEach(fn); } },
      { match: /^before.*$/, fn: function (_, fn) { context.before(fn); } },
      { match: /^after.*$/, fn: function (_, fn) { context.after(fn); } }
    ];

    var suiteMapping = [
      { match: /^Skip.*$/, fn: context.describe.skip },
      { match: /^X.*$/, fn: context.describe.skip },
      { match: /^Only.*$/, fn: context.describe.only },
      { match: /^.*$/, fn: context.describe }
    ];

    function visit (Clss, file) {
      var name = Clss.name || file;

      for (var item of suiteMapping) {
        if (name.match(item.match)) {
          item.fn(name, function () {
            var instance = new Clss(context);
            Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(function (method) {
              for (var item of testMapping) {
                if (method.match(item.match)) {
                  item.fn(method, instance[method].bind(instance));
                  return;
                }
              }
            });
          });
          return;
        }
      }
    }
  });
};
