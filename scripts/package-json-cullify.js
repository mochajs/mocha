'use strict';

/**
 * This is a transform stream used to cull "package.json" results
 * when our source is transformed for our Browserify bundle.
 *
 * Based on Nolan Lawson's "package-json-versionify" package.
 */

const browserifyPackageJSON = require('browserify-package-json');

module.exports = function(filename, options) {
  const fieldsToKeep = ['name', 'version', 'homepage', 'notifyLogo'];
  const bpjOptions = Object.assign(options || {}, {only: fieldsToKeep});

  return browserifyPackageJSON(filename, bpjOptions);
};
