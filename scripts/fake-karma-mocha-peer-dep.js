/**
 * intended to be run during "preinstall" lifecycle;
 * replaces `karma-mocha`'s peerDependency of `mocha` with this package
 */

'use strict';

if (process.env.npm_config_production !== 'true') {
  var fs = require('fs');
  var path = require('path');
  var linkTarget = process.cwd();
  var linkPath = path.join(linkTarget, 'node_modules', 'mocha');

  try {
    // if this exists and is a symlink, leave it
    // if this exists and is NOT a symlink (which is weird), leave that too
    fs.statSync(linkPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      try {
        fs.symlinkSync(linkTarget,
          path.join(linkTarget, 'node_modules', 'mocha'), 'dir');
      } catch (ignored) {
        // oh well, maybe it'll be ok!
      }
    }
  }
}
