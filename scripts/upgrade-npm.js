#!/usr/bin/env node

/**
 * This upgrades npm on Travis when using Node.js 0.8x
 */

if (process.env.TRAVIS_NODE_VERSION === '0.8') {
  var exec = require('child_process').exec;
  // ensure *dependencies* can be installed using provided npm
  exec('npm install --production', function (err) {
    if (err) {
      throw new Error(err);
    }
    exec('npm install --global npm@2', function (err) {
      if (err) {
        throw new Error(err);
      }
      console.log('Upgraded to npm@2');
    });
  });
}
