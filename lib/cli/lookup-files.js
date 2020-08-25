'use strict';

/**
 * Contains `lookupFiles`, which takes some globs/dirs/options and returns a list of files.
 * @module
 * @private
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var {format} = require('util');
var errors = require('../errors');
var createNoFilesMatchPatternError = errors.createNoFilesMatchPatternError;
var createMissingArgumentError = errors.createMissingArgumentError;
var {sQuote, dQuote} = require('../utils');

/**
 * Determines if pathname would be a "hidden" file (or directory) on UN*X.
 *
 * @description
 * On UN*X, pathnames beginning with a full stop (aka dot) are hidden during
 * typical usage. Dotfiles, plain-text configuration files, are prime examples.
 *
 * @see {@link http://xahlee.info/UnixResource_dir/writ/unix_origin_of_dot_filename.html|Origin of Dot File Names}
 *
 * @private
 * @param {string} pathname - Pathname to check for match.
 * @return {boolean} whether pathname would be considered a hidden file.
 * @example
 * isHiddenOnUnix('.profile'); // => true
 */
function isHiddenOnUnix(pathname) {
  return path.basename(pathname)[0] === '.';
}

/**
 * Determines if pathname has a matching file extension.
 *
 * @private
 * @param {string} pathname - Pathname to check for match.
 * @param {string[]} exts - List of file extensions (sans period).
 * @return {boolean} whether file extension matches.
 * @example
 * hasMatchingExtname('foo.html', ['js', 'css']); // => false
 */
function hasMatchingExtname(pathname, exts) {
  var suffix = path.extname(pathname).slice(1);
  return exts.some(function(element) {
    return suffix === element;
  });
}

/**
 * Lookup file names at the given `path`.
 *
 * @description
 * Filenames are returned in _traversal_ order by the OS/filesystem.
 * **Make no assumption that the names will be sorted in any fashion.**
 *
 * @public
 * @alias module:lib/cli.lookupFiles
 * @param {string} filepath - Base path to start searching from.
 * @param {string[]} [extensions=[]] - File extensions to look for.
 * @param {boolean} [recursive=false] - Whether to recurse into subdirectories.
 * @return {string[]} An array of paths.
 * @throws {Error} if no files match pattern.
 * @throws {TypeError} if `filepath` is directory and `extensions` not provided.
 */
module.exports = function lookupFiles(filepath, extensions, recursive) {
  extensions = extensions || [];
  recursive = recursive || false;
  var files = [];
  var stat;

  if (!fs.existsSync(filepath)) {
    var pattern;
    if (glob.hasMagic(filepath)) {
      // Handle glob as is without extensions
      pattern = filepath;
    } else {
      // glob pattern e.g. 'filepath+(.js|.ts)'
      var strExtensions = extensions
        .map(function(v) {
          return '.' + v;
        })
        .join('|');
      pattern = filepath + '+(' + strExtensions + ')';
    }
    files = glob.sync(pattern, {nodir: true});
    if (!files.length) {
      throw createNoFilesMatchPatternError(
        'Cannot find any files matching pattern ' + dQuote(filepath),
        filepath
      );
    }
    return files;
  }

  // Handle file
  try {
    stat = fs.statSync(filepath);
    if (stat.isFile()) {
      return filepath;
    }
  } catch (err) {
    // ignore error
    return;
  }

  // Handle directory
  fs.readdirSync(filepath).forEach(function(dirent) {
    var pathname = path.join(filepath, dirent);
    var stat;

    try {
      stat = fs.statSync(pathname);
      if (stat.isDirectory()) {
        if (recursive) {
          files = files.concat(lookupFiles(pathname, extensions, recursive));
        }
        return;
      }
    } catch (err) {
      // ignore error
      return;
    }
    if (!extensions.length) {
      throw createMissingArgumentError(
        format(
          'Argument %s required when argument %s is a directory',
          sQuote('extensions'),
          sQuote('filepath')
        ),
        'extensions',
        'array'
      );
    }

    if (
      !stat.isFile() ||
      !hasMatchingExtname(pathname, extensions) ||
      isHiddenOnUnix(pathname)
    ) {
      return;
    }
    files.push(pathname);
  });

  return files;
};
