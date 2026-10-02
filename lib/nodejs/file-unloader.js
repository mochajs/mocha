/**
 * This module should not be in the browser bundle, so it's here.
 * @private
 * @module
 */

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Deletes a file from the `require` cache.
 * A file that no longer exists on disk has nothing left to unload.
 * @param {string} file - File
 */
export function unloadFile(file) {
  let resolved;
  try {
    resolved = require.resolve(file);
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      return;
    }
    throw err;
  }
  delete require.cache[resolved];
}
