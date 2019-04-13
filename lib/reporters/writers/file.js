'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var errors = require('../../errors');

var createUnsupportedError = errors.createUnsupportedError;

/**
 * Provides methods used for output by file-oriented reporters.
 *
 * @description
 * Not meant to be used directly.
 *
 * @package
 * @mixin FileWriter
 */
var FileWriter = function() {
  /**
   * Writes string to reporter output.
   *
   * @package
   * @param {string} str - String to write to the reporter output.
   * @returns {this}
   * @chainable
   */
  this.write = function(str) {
    this._fileStream.write(str);
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
   * @description
   * Closes the filesystem output stream.
   *
   * @package
   * @param {Function} cb - Callback invoked when cleanup done
   */
  this._done = function(cb) {
    var self = this;
    this._fileStream.end(function() {
      self._fileStream = null;
      cb();
    });
  };

  return this;
};

/**
 * Creates filesystem output stream, if possible.
 *
 * @static
 * @package
 * @param {Object} reporter - Instance of reporter
 * @param {string} pathname - Pathname of desired output file
 * @throws Various errors are possible
 */
FileWriter.createWriteStream = function(reporter, pathname) {
  if (!fs.createWriteStream) {
    throw createUnsupportedError('file output not supported in browser');
  }

  mkdirp.sync(path.dirname(pathname));
  reporter._fileStream = fs.createWriteStream(pathname);
};

/**
 * Determines if writer should write output to filesystem.
 *
 * @public
 * @static
 * @returns {boolean} whether writer should use `FileWriter` methods
 */
FileWriter.isFileWriter = function(reporter) {
  return reporter.hasOwnProperty('_fileStream') && !!reporter._fileStream;
};

module.exports = FileWriter;
