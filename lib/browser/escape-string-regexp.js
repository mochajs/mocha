'use strict';

/**
 * Expose `escape`.
 */

module.exports = escape;

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

/**
 * @param {string} str
 * @return {string}
 */
function escape(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return str.replace(matchOperatorsRe, '\\$&');
}
