'use strict';

/**
 * Save timer references (mochajs/mocha#237).
 */
var setTimeout = global.setTimeout;

/**
 * Provides methods used for output by console-oriented reporters.
 *
 * @description
 * Not meant to be used directly.
 *
 * @package
 * @mixin ConsoleWriter
 */
var ConsoleWriter = function() {
  var buffer = '';

  /**
   * Writes string to reporter output.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.write = function(str) {
    if (str) {
      buffer += str; // Store until `console.log` invoked
    }
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
    this.write(str);
    console.log(buffer);
    buffer = ''; // Reset
    return this;
  };

  /**
   * Invokes provided completion function.
   *
   * @description
   * Writes any buffered output.
   *
   * @package
   * @param {Function} cb - Callback invoked when cleanup done
   */
  this._done = function(cb) {
    if (buffer) {
      var delay = 1000; // One second

      this.writeln();
      setTimeout(cb, delay);
    } else {
      cb();
    }
  };

  return this;
};

module.exports = ConsoleWriter;
