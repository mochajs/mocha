'use strict';

var bddInterface = require('./bdd');
var behavior = require('../behavior');

/**
 * Functional BDD-style interface:
 *
 *      describe('Array', () => {
 *        describe('#indexOf()', () => {
 *          it('should return -1 when not present', () => {
 *            // ...
 *          });
 *          it('passes ctx as param', test => {})
 *          it('uses async as second param , )
 *        });
 *      });
 *
 * @param {Suite} suite Root suite.
 */
module.exports = function funcInterface(suite) {
  suite.behavior(behavior.Functional);
  bddInterface(suite);
};
