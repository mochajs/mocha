/**
 * This module should not be in the browser bundle, so it's here.
 * @private
 * @module
 */

import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Deletes a file from the `require` cache.
 * @param {string} file - File
 */
export function unloadFile(file) {
  delete require.cache[require.resolve(file)];
}
