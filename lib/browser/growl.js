'use strict';

/**
 * Web Notifications module.
 * @module Growl
 */

/**
 * @summary
 * Checks if browser notification support exists.
 *
 * @public
 * @see {@link https://caniuse.com/#feat=notifications|Browser support (notifications)}
 * @see {@link https://caniuse.com/#feat=promises|Browser support (promises)}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlCapable}
 * @return {boolean} whether browser notification support exists
 */
exports.isCapable = function() {
  var hasNotificationSupport = 'Notification' in window;
  var hasPromiseSupport = typeof Promise === 'function';
  return process.browser && hasNotificationSupport && hasPromiseSupport;
};

/**
 * Implements browser notifications as a pseudo-reporter.
 *
 * @public
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/notification|Notification API}
 * @see {@link https://developers.google.com/web/fundamentals/push-notifications/display-a-notification|Displaying a Notification}
 * @see {@link Growl#isPermitted}
 * @see {@link Mocha#_growl}
 * @param {Runner} runner - Runner instance.
 */
exports.notify = function(runner) {
  var promise = isPermitted();

  /**
   * Attempt notification.
   */
  var sendNotification = function() {
    // If user hasn't responded yet... "No notification for you!" (Seinfeld)
    Promise.race([promise, Promise.resolve(undefined)])
      .then(canNotify)
      .then(function() {
        display(runner);
      })
      .catch(notPermitted);
  };

  runner.once('end', sendNotification);
};

/**
 * Checks if browser notification is permitted by user.
 *
 * @private
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission|Notification.permission}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlPermitted}
 * @returns {Promise<boolean>} promise determining if browser notification
 *     permissible when fulfilled.
 */
function isPermitted() {
  var permitted = {
    granted: Promise.resolve(true),
    denied: Promise.resolve(false),
    default: (function ask() {
      Notification.requestPermission().then(function(permission) {
        return Promise.resolve(permission === 'granted');
      });
    })()
  };

  return permitted[Notification.permission];
}

/**
 * A promise determining if notification can proceed.
 *
 * @promise Growl~CanNotifyPromise
 * @fulfill {boolean} Notification allowed (<code>true</code>).
 * @reject {Error} Notification denied (or request unacknowledged) by user.
 */

/**
 * @summary
 * Determines if notification should proceed.
 *
 * @description
 * Notification should <strong>not</strong> proceed unless `value` is true.
 *
 * `value` will equal one of:
 * <ul>
 *   <li><code>true</code> (from `isPermitted`)</li>
 *   <li><code>false</code> (from `isPermitted`)</li>
 *   <li><code>undefined</code> (from `Promise.race`)</li>
 * </ul>
 *
 * @private
 * @param {Promise<boolean|undefined>} value - Determines if browser
 *     notification permissible when fulfilled.
 * @returns {Growl~CanNotifyPromise} Should notification proceed?
 */
function canNotify(value) {
  if (!value) {
    var why = value === false ? 'blocked' : 'unacknowledged';
    var reason = 'not permitted by user (' + why + ')';
    return Promise.reject(new Error(reason));
  }
  return Promise.resolve(true);
}

/**
 * Displays the notification.
 *
 * @param {Runner} runner - Runner instance.
 * @private
 */
function display(runner) {
  var stats = runner.stats;
  var symbol = {
    cross: '\u274C',
    tick: '\u2705'
  };
  var logo = require('../../package').logo;
  var lang = 'en-US';
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
    badge: logo,
    body: message,
    icon: logo,
    lang: lang,
    name: 'mocha',
    requireInteraction: false,
    tag: generateTag(),
    timestamp: Date.now()
  };
  var notification = new Notification(title, options);

  // Autoclose after brief delay (makes various browsers act same)
  var FORCE_DURATION = 4000;
  setTimeout(notification.close.bind(notification), FORCE_DURATION);
}

/**
 * As notifications are tangential to our purpose, just log the error.
 *
 * @private
 * @param {Error} err - Why notification didn't happen.
 */
function notPermitted(err) {
  console.error('notification error:', err.message);
}

/**
 * Used to help distinguish notifications within a root suite run.
 * @type {number}
 */
var ntags = 0;

/**
 * @summary
 * Generates a datestamped, run-unique tag for each notification.
 *
 * @description
 * Use of a tag allows notifications that represent the same conceptual event
 * to specify as much. This implementation doesn't really bother.
 *
 * @private
 * @returns {string} tag unique within a root suite execution
 * @example
 *
 * generateTag();
 * // => "mocha_results-20181117-1"
 */
function generateTag() {
  return ['mocha_results', datestamp(), ++ntags].join('-');
}

/**
 * Generates a datestamp.
 *
 * @private
 * @returns {string} tag in YYYYMMDD format
 * @example
 *
 * datestamp();
 * // => "20181117"
 */
function datestamp() {
  var now = new Date(Date.now());
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();

  return '' + year + (month < 10 ? '0' : '') + month + day;
}
