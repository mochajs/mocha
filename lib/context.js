
/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api private
 */

function Context(){}

/**
 * Set the context `Test` to `test`.
 *
 * @param {Test} test
 * @return {Context}
 * @api private
 */

Context.prototype.test = function(test){
  this._test = test;
  return this;
};

/**
 * Set test timeout `ms`.
 *
 * @param {Number} ms
 * @return {Context} self
 * @api private
 */

Context.prototype.timeout = function(ms){
  this._test.timeout(ms);
  return this;
};

/**
 * Inspect the context void of `._test`.
 *
 * @return {String}
 * @api private
 */

Context.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    return '_test' == key
      ? undefined
      : val;
  }, 2);
};
