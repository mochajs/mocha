
/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api private
 */

function Context(){
  this._mocha = {};

  /**
   * Set or get the context `Runnable` to `runnable`.
   *
   * @param {Runnable} runnable
   * @return {Context}
   * @api private
   */
  this._mocha.runnable = function(runnable){
    if (0 == arguments.length) return this._runnable;
    this.test = this._runnable = runnable;
    return this;
  };

  /**
   * Set test timeout `ms`.
   *
   * @param {Number} ms
   * @return {Context} self
   * @api private
   */

  this._mocha.timeout = function(ms){
    this.runnable().timeout(ms);
    return this;
  };

  /**
   * Inspect the context void of `._runnable`.
   *
   * @return {String}
   * @api private
   */

  this._mocha.inspect = function(){
    return JSON.stringify(this, function(key, val){
      if ('_runnable' == key) return;
      if ('test' == key) return;
      return val;
    }, 2);
  };
}
