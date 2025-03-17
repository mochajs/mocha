'use strict';

/**
 * Parse the given `qs`.
 *
 * @private
 * @param {string} qs
 * @return {Object<string, string>}
 */
module.exports = function parseQuery (qs) {
  return qs
    .replace('?', '')
    .split('&')
    .reduce(function (obj, pair) {
      let i = pair.indexOf('=');
      const key = pair.slice(0, i);
      const val = pair.slice(++i);

      // Due to how the URLSearchParams API treats spaces
      obj[key] = decodeURIComponent(val.replace(/\+/g, '%20'));

      return obj;
    }, {});
};
