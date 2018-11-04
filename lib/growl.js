'use strict';
/**
 * @module Growl
 */

var fs = require('fs');
var os = require('os');
var path = require('path');

/**
 * @summary
 * Checks if Growl support seems likely.
 *
 * @description
 * Glosses over the distinction between an unsupported platform
 * and one that lacks prerequisite software installations.
 * Autofails when run in browser.
 *
 * @public
 * @see {@link https://github.com/tj/node-growl/blob/master/README.md|Prerequisite Installs}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlCapable}
 * @return {boolean} whether Growl support can be expected
 */
exports.isCapable = function() {
  return !process.browser && which(getSupportBinaries()) !== '';
};

/**
 * Implements desktop notifications as a pseudo-reporter.
 *
 * @public
 * @see {@link Mocha#_growl}
 * @param {Runner} runner - Runner instance.
 */
exports.notify = function(runner) {
  var sendNotification = function() {
    var growl = require('growl');
    var stats = runner.stats;
    var msg;
    var options;

    if (stats.failures) {
      msg = stats.failures + ' of ' + runner.total + ' tests failed';
      options = {
        name: 'mocha',
        title: 'Failed',
        image: image('error')
      };
    } else {
      msg = stats.passes + ' tests passed in ' + stats.duration + 'ms';
      options = {
        name: 'mocha',
        title: 'Passed',
        image: image('ok')
      };
    }
    growl(msg, options, onCompletion);
  };

  /**
   * @summary
   * Callback for result of attempted Growl notification.
   *
   * @description
   * Despite its appearance, this is <strong>not</strong> an Error-first
   * callback -- all parameters are populated regardless of success.
   *
   * @callback Growl~growlCB
   * @param {*} err - Error object, or <code>null</code> if successful.
   * @param {string} stdout - <code>stdout</code> from notification delivery
   *     process.
   * @param {string} stderr - <code>stderr</code> from notification delivery
   *     process. It will include timestamp and executed command with arguments.
   */

  function onCompletion(err, stdout, stderr) {
    if (err) {
      var detail =
        err.code === 'ENOENT' ? 'prerequisite software not found' : err.message;
      console.error('Growl notification error:', detail);
    }
  }

  runner.once('end', sendNotification);
};

/**
 * Returns Growl image `name` path.
 *
 * @private
 * @param {string} name - Basename of associated Growl image.
 * @return {string} Pathname to Growl image
 */
function image(name) {
  return path.join(__dirname, '..', 'assets', 'growl', name + '.png');
}

/**
 * @summary
 * Locates a binary in the user's `PATH`.
 *
 * @description
 * Takes a list of command names and searches the path for each executable
 * file that would be run had these commands actually been invoked.
 *
 * @private
 * @param {string[]} binaries - Names of binary files to search for.
 * @return {string} absolute path of first binary found, or empty string if none
 */
function which(binaries) {
  var paths = process.env.PATH.split(path.delimiter);
  var exists = fs.existsSync || path.existsSync;

  for (var n = 0, blen = binaries.length; n < blen; n++) {
    var binary = binaries[n];
    var loc;
    for (var i = 0, plen = paths.length; i < plen; i++) {
      loc = path.join(paths[i], binary);
      if (exists(loc)) {
        return loc;
      }
    }
  }
  return '';
}

/**
 * @summary
 * Gets platform-specific Growl support binaries.
 *
 * @description
 * Somewhat brittle dependency on `growl` package implementation, but it
 * rarely changes.
 *
 * @private
 * @see {@link https://github.com/tj/node-growl/blob/master/lib/growl.js#L28-L126|setupCmd}
 * @return {string[]} names of Growl support binaries
 */
function getSupportBinaries() {
  var binaries = {
    Darwin: ['terminal-notifier', 'growlnotify'],
    Linux: ['notify-send', 'growl'],
    Windows_NT: ['growlnotify']
  };
  return binaries[os.type()] || [];
}
