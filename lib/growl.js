'use strict';

/**
 * Desktop Notifications module.
 * @module Growl
 */

var fs = require('fs');
var os = require('os');
var path = require('path');

/**
 * @summary
 * Checks if Growl notification support seems likely.
 *
 * @description
 * Glosses over the distinction between an unsupported platform
 * and one that lacks prerequisite software installations.
 *
 * @public
 * @see {@link https://github.com/tj/node-growl/blob/master/README.md|Prerequisite Installs}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlCapable}
 * @return {boolean} whether Growl notification support can be expected
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
    display(runner);
  };
  runner.once('end', sendNotification);
};

/**
 * Displays the notification.
 *
 * @private
 * @param {Runner} runner - Runner instance.
 */
function display(runner) {
  var growl = require('growl');
  var stats = runner.stats;
  var symbol = {
    cross: '\u274C',
    tick: '\u2705'
  };
  var _message;
  var message;
  var title;

  if (stats.failures) {
    _message = stats.failures + ' of ' + runner.total + ' tests failed';
    message = symbol.cross + ' ' + _message;
    title = 'Failed';
  } else {
    _message = stats.passes + ' tests passed in ' + stats.duration + 'ms';
    message = symbol.tick + ' ' + _message;
    title = 'Passed';
  }

  // Send notification
  var options = {
    image: logo(),
    name: 'mocha',
    title: title
  };
  growl(message, options, onCompletion);
}

/**
 * @summary
 * Callback for result of attempted Growl notification.
 *
 * @description
 * Despite its appearance, this is <strong>not</strong> an Error-first
 * callback -- all parameters are populated regardless of success.
 *
 * @private
 * @callback Growl~growlCB
 * @param {*} err - Error object, or <code>null</code> if successful.
 * @param {string} stdout - <code>stdout</code> from notification delivery
 *     process.
 * @param {string} stderr - <code>stderr</code> from notification delivery
 *     process. It will include timestamp and executed command with arguments.
 */
function onCompletion(err, stdout, stderr) {
  if (err) {
    // As notifications are tangential to our purpose, just log the error.
    var message =
      err.code === 'ENOENT' ? 'prerequisite software not found' : err.message;
    console.error('notification error:', message);
  }
}

/**
 * Returns Mocha logo image path.
 *
 * @private
 * @return {string} Pathname of Mocha logo
 */
function logo() {
  return path.join(__dirname, '..', 'assets', 'mocha-logo-96.png');
}

/**
 * @summary
 * Locates a binary in the user's `PATH` environment variable.
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

  for (var n = 0, blen = binaries.length; n < blen; n++) {
    var binary = binaries[n];
    for (var i = 0, plen = paths.length; i < plen; i++) {
      var loc = path.join(paths[i], binary);
      if (fs.existsSync(loc)) {
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
    Windows_NT: ['growlnotify.exe']
  };
  return binaries[os.type()] || [];
}
