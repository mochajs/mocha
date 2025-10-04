'use strict';

/**
 * Contains `lookupFiles`, which takes some globs/dirs/options and returns a list of files.
 * @module
 * @private
 */

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');
const {
  createNoFilesMatchPatternError,
  createMissingArgumentError
} = require('../errors');
const debug = require('debug')('mocha:cli:lookup-files');

/** @typedef {`.${string}`} HiddenUnixPathname */

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
 * @returns {value is HiddenUnixPathname} whether pathname would be considered a hidden file.
 * @example
 * isHiddenOnUnix('.profile'); // => true
 */
const isHiddenOnUnix = pathname => path.basename(pathname)[0] === '.';

/** @typedef {`.${string}`} FileExtension */

/**
 * Normalize file extensions to ensure they have a leading period character.
 *
 * @private
 * @param {FileExtension[]|string[]|undefined|null} exts
 * @returns {FileExtension[]}
 */
const normalizeFileExtensions = (exts) => {
  if (!exts) {
    return [];
  }

  for (var i = 0; i < exts.length; i++) {
    if (exts[i][0] !== '.') {
      exts[i] = `.${exts[i]}`;
    }
  }
  return /** @type {FileExtension[]} */ (exts);
}

/**
 * Determines if pathname has a matching file extension.
 *
 * @private
 * @param {string} pathname - Pathname to check for match.
 * @param {FileExtension[]} fileExtensions - List of file extensions, w/-or-w/o leading period
 * @returns {boolean} `true` if file extension matches.
 * @example
 * hasMatchingFileExtension('foo.html', ['js', 'css']); // false
 * hasMatchingFileExtension('foo.js', ['.js']); // true
 * hasMatchingFileExtension('foo.js', ['js']); // ture
 */
const hasMatchingFileExtension = (pathname, fileExtensions) => {
  for (var i = 0; i < fileExtensions.length; i++) {
    if (pathname.endsWith(fileExtensions[i])) {
      return true;
    }
  }
  return false;
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
 * @param {string[]} [fileExtensions=[]] - File extensions to look for.
 * @param {boolean} [recursive=false] - Whether to recurse into subdirectories.
 * @returns {string[]} An array of paths.
 * @throws {Error} if no files match pattern.
 * @throws {TypeError} if `filepath` is directory and `fileExtensions` not 
 * provided or an empty array.
 */
module.exports = function lookupFiles(
  filepath,
  fileExtensions,
  recursive = false
) {
  const files = [];
  fileExtensions = normalizeFileExtensions(fileExtensions);

  // Detect glob patterns by checking if the path does not exist as-is
  if (!fs.existsSync(filepath)) {
    let pattern;
    if (glob.hasMagic(filepath, { windowsPathsNoEscape: true })) {
      // Handle glob as is without extensions
      pattern = filepath;
    } else {
      // glob pattern e.g. 'filepath+(.js|.ts)'
      pattern = `${filepath}+(${fileExtensions.join('|')})`;
      debug('looking for files using glob pattern: %s', pattern);
    }
    files.push(
      ...glob
        .sync(pattern, {
          nodir: true,
          windowsPathsNoEscape: true
        })
        // glob@8 and earlier sorted results in en; glob@9 depends on OS sorting.
        // This preserves the older glob behavior.
        // https://github.com/mochajs/mocha/pull/5250/files#r1840469747
        .sort((a, b) => a.localeCompare(b, 'en'))
    );
    if (!files.length) {
      throw createNoFilesMatchPatternError(
        `Cannot find any files matching pattern "${filepath}"`,
        filepath
      );
    }
    return files;
  }

  const stat = fs.statSync(filepath, {
    throwIfNoEntry: false
  });

  if (stat === undefined) {
    // Unreachable because glob check already checks if path exists, but for
    // completeness...
  } else if (stat.isFile()) {
    files.push(filepath);
  } else if (stat.isDirectory()) {
    if (fileExtensions.length === 0) {
      throw createMissingArgumentError(
        `Argument '${fileExtensions}' required when argument '${filepath}' is a directory`,
        'extensions',
        'array'
      )
    }

    // Handle directory
    const dirEnts = fs.readdirSync(filepath, { recursive, withFileTypes: true });

    for (var i = 0; i < dirEnts.length; i++) {
      const dirEnt = dirEnts[i];

      const pathname = dirEnt.parentPath
        ? path.join(dirEnt.parentPath, dirEnt.name)
        : path.join(filepath, dirEnt.name);

      if (dirEnt.isFile() || dirEnt.isSymbolicLink()) {
        if (dirEnt.isSymbolicLink()) {
          const stat = fs.statSync(pathname, { throwIfNoEntry: false });
          if (!stat || !stat.isFile()) {
            continue; // Skip broken symlinks or symlinks to directories
          }
        }

        if (
          hasMatchingFileExtension(pathname, /** @type {FileExtension[]} */(fileExtensions)) &&
          !isHiddenOnUnix(pathname)
        ) {
          files.push(pathname);
        }
      }
    }
  }

  return files;
};
