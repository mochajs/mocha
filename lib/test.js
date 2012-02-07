
/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Test`.
 */

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Test(title, fn) {
  Runnable.call(this, title, fn);
  this.pending = !fn;
  this.type = 'test';
}

/**
 * Inherit from `Runnable.prototype`.
 */

Test.prototype.__proto__ = Runnable.prototype;

/**
 * Inspect the context void of private properties.
 *
 * @return {String}
 * @api private
 */

Test.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    return '_' == key[0]
      ? undefined
      : 'parent' == key
        ? '#<Suite>'
        : val;
  }, 2);
};