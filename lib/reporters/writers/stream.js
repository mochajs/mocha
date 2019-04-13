'use strict';

/**
 * Provides methods used for output by stream-oriented reporters.
 *
 * @description
 * Not meant to be used directly.
 *
 * @package
 * @mixin StreamWriter
 */
var StreamWriter = function() {
  var stream = process.stdout;

  /**
   * Writes string to reporter output.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.write = function(str) {
    stream.write(str);
    return this;
  };

  /**
   * Writes newline-terminated string to reporter output.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.writeln = function(str) {
    return this.write(str + '\n');
  };

  /**
   * Invokes provided completion function.
   *
   * @package
   * @param {Function} cb - Callback invoked when cleanup done
   */
  this._done = function(cb) {
    cb();
  };

  return this;
};

module.exports = StreamWriter;
