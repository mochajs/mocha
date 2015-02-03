/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Hook(title, fn) {
  Runnable.call(this, title, fn);
  this.type = 'hook';
}

/**
 * Inherit from `Runnable.prototype`.
 */

Hook.prototype.__proto__ = Runnable.prototype;

/**
 * Get or set the test `err`.
 *
 * @param {Error} err
 * @return {Error}
 * @api public
 */

Hook.prototype.error = function(err){
  if (0 == arguments.length) {
    var err = this._error;
    this._error = null;
    return err;
  }

  this._error = err;
};

/**
 * Return the short title of the hook, along with the
 * the title of the test currently associated with the hook.
 *
 * @return {String}
 * @api public
 */

Hook.prototype.shortTitle = function(){
  var title = Runnable.prototype.shortTitle.call(this);

  if (this.ctx && this.ctx.currentTest) {
    var testTitle = this.ctx.currentTest.shortTitle();
    if (testTitle) {
      title = title + ' for "' + testTitle + '"';
    }
  }
  return title;
};
