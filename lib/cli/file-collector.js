'use strict';

var debug = require('debug')('mocha:cli:file:collector');
var utils = require('../utils');
var collectFiles = require('./collect-files');

exports = module.exports = FileCollector;

/**
 * Constructs a new `FileCollector` instance.
 * Collect file path string with given options through user input.
 *
 * @public
 * @class
 * @param {Object} options - Command line options
 */
function FileCollector(options) {
  options = options || {};
  this.ignore = options.ignore || [];
  this.extension = options.extension || [];
  this.recursive = options.recursive === true;
  this.sort = options.sort === true;
  this.spec = options.spec || [];

  this.file = options.file || [];
  if (!Array.isArray(this.file)) {
    if (isString(this.file)) {
      this.file = [this.file];
    } else {
      this.file = [];
    }
  }

  // more suitable in utils
  function isString(v) {
    return v instanceof String || typeof v === 'string';
  }
}

FileCollector.prototype.getSingleFiles = function getSingleFiles() {
  var files = collectFiles({
    ignore: this.ignore,
    extension: this.extension,
    file: this.file,
    recursive: this.recursive,
    sort: this.sort,
    spec: this.spec
  });
  debug('getFiles from FileCollector: ' + files);
  return files;
};

FileCollector.prototype.getWatchFiles = function getWatchFiles() {
  return utils.files(process.cwd(), this.extension);
};
