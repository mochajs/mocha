/**
 * This module should not be in the browser bundle, so it's here.
 * @private
 * @module
 */

import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * Resolves `file` to the key it would occupy in the `require` cache.
 * @param {string} file - File path or module specifier
 * @returns {string|undefined} Resolved filename, or `undefined` if not found
 */
function resolveFile(file) {
  const candidates =
    path.isAbsolute(file) || /^\.\.?(?:[\\/]|$)/.test(file)
      ? [path.resolve(file)]
      : // A bare input may be a package specifier or a cwd-relative path such
        // as `test/a.spec.js`; prefer Node's module lookup, then the cwd.
        [file, path.resolve(file)];
  for (const candidate of candidates) {
    try {
      return require.resolve(candidate);
    } catch (err) {
      if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
      }
    }
  }
  return undefined;
}

/**
 * Deletes a file from the `require` cache.
 * Relative paths are resolved against the current working directory,
 * matching how {@link Mocha#loadFiles} loads them; bare module specifiers
 * are still resolved through Node's module lookup.
 * A file that no longer exists on disk has nothing left to unload.
 * @param {string} file - File
 */
export function unloadFile(file) {
  const resolved = resolveFile(file);
  if (resolved !== undefined) {
    delete require.cache[resolved];
  }
}
