/**
 * This module should not be in the browser bundle, so it's here.
 * @private
 * @module
 */

import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * Deletes a file from the `require` cache.
 * Relative paths are resolved against the current working directory,
 * matching how {@link Mocha#loadFiles} loads them.
 * A file that no longer exists on disk has nothing left to unload.
 * @param {string} file - File
 */
export function unloadFile(file) {
  let resolved;
  try {
    resolved = require.resolve(path.resolve(file));
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      return;
    }
    throw err;
  }
  delete require.cache[resolved];
}
