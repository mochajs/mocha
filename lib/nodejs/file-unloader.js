'use strict';

/**
 * This module should not be in the browser bundle, so it's here.
 * @private
 * @module
 */
const path = require('path');

/**
 * Deletes a file from the `require` cache. Resolve the file first to prevent
 * MODULE_NOT_FOUND for relative paths.
 *
 * @see https://github.com/mochajs/mocha/issues/4548
 * @param {string} file - File
 */
exports.unloadFile = file => {
  const absoluteModulePath = require.resolve(path.resolve(file));
  delete require.cache[absoluteModulePath];
};
