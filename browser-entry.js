'use strict';

/* eslint no-unused-vars: off */
/* eslint-env commonjs */

/**
 * Shim process.stdout.
 */

process.stdout = require('browser-stdout')({ label: false });

const parseQuery = require('./lib/browser/parse-query');
const highlightTags = require('./lib/browser/highlight-tags');
const Mocha = require('./lib/mocha');

/**
 * Create a Mocha instance.
 *
 * @return {undefined}
 */

const mocha = new Mocha({ reporter: 'html' });

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

const Date = global.Date;
const setTimeout = global.setTimeout;
const setInterval = global.setInterval;
const clearTimeout = global.clearTimeout;
const clearInterval = global.clearInterval;

const uncaughtExceptionHandlers = [];

const originalOnerrorHandler = global.onerror;

/**
 * Remove uncaughtException listener.
 * Revert to original onerror handler if previously defined.
 */

process.removeListener = function (e, fn) {
  if (e === 'uncaughtException') {
    if (originalOnerrorHandler) {
      global.onerror = originalOnerrorHandler;
    } else {
      global.onerror = function () {};
    }
    const i = uncaughtExceptionHandlers.indexOf(fn);
    if (i !== -1) {
      uncaughtExceptionHandlers.splice(i, 1);
    }
  }
};

/**
 * Implements listenerCount for 'uncaughtException'.
 */

process.listenerCount = function (name) {
  if (name === 'uncaughtException') {
    return uncaughtExceptionHandlers.length;
  }
  return 0;
};

/**
 * Implements uncaughtException listener.
 */

process.on = function (e, fn) {
  if (e === 'uncaughtException') {
    global.onerror = function (msg, url, line, col, err) {
      fn(err || new Error(msg + ' (' + url + ':' + line + ':' + col + ')'));
      return !mocha.options.allowUncaught;
    };
    uncaughtExceptionHandlers.push(fn);
  }
};

process.listeners = function (e) {
  if (e === 'uncaughtException') {
    return uncaughtExceptionHandlers;
  }
  return [];
};

// The BDD UI is registered by default, but no UI will be functional in the
// browser without an explicit call to the overridden `mocha.ui` (see below).
// Ensure that this default UI does not expose its methods to the global scope.
mocha.suite.removeAllListeners('pre-require');

const immediateQueue = [];
let immediateTimeout;

function timeslice () {
  const immediateStart = new Date().getTime();
  while (immediateQueue.length && new Date().getTime() - immediateStart < 100) {
    immediateQueue.shift()();
  }
  if (immediateQueue.length) {
    immediateTimeout = setTimeout(timeslice, 0);
  } else {
    immediateTimeout = null;
  }
}

/**
 * High-performance override of Runner.immediately.
 */

Mocha.Runner.immediately = function (callback) {
  immediateQueue.push(callback);
  if (!immediateTimeout) {
    immediateTimeout = setTimeout(timeslice, 0);
  }
};

/**
 * Function to allow assertion libraries to throw errors directly into mocha.
 * This is useful when running tests in a browser because window.onerror will
 * only receive the 'message' attribute of the Error.
 */
mocha.throwError = function (err) {
  uncaughtExceptionHandlers.forEach(function (fn) {
    fn(err);
  });
  throw err;
};

/**
 * Override ui to ensure that the ui functions are initialized.
 * Normally this would happen in Mocha.prototype.loadFiles.
 */

mocha.ui = function (ui) {
  Mocha.prototype.ui.call(this, ui);
  this.suite.emit('pre-require', global, null, this);
  return this;
};

/**
 * Setup mocha with the given setting options.
 */

mocha.setup = function (opts) {
  if (typeof opts === 'string') {
    opts = { ui: opts };
  }
  if (opts.delay === true) {
    this.delay();
  }
  const self = this;
  Object.keys(opts)
    .filter(function (opt) {
      return opt !== 'delay';
    })
    .forEach(function (opt) {
      if (Object.prototype.hasOwnProperty.call(opts, opt)) {
        self[opt](opts[opt]);
      }
    });
  return this;
};

/**
 * Run mocha, returning the Runner.
 */

mocha.run = function (fn) {
  const options = mocha.options;
  mocha.globals('location');

  const query = parseQuery(global.location.search || '');
  if (query.grep) {
    mocha.grep(query.grep);
  }
  if (query.fgrep) {
    mocha.fgrep(query.fgrep);
  }
  if (query.invert) {
    mocha.invert();
  }

  return Mocha.prototype.run.call(mocha, function (err) {
    // The DOM Document is not available in Web Workers.
    const document = global.document;
    if (
      document &&
      document.getElementById('mocha') &&
      options.noHighlighting !== true
    ) {
      highlightTags('code');
    }
    if (fn) {
      fn(err);
    }
  });
};

/**
 * Expose the process shim.
 * https://github.com/mochajs/mocha/pull/916
 */

Mocha.process = process;

/**
 * Expose mocha.
 */
global.Mocha = Mocha;
global.mocha = mocha;

// for bundlers: enable `import {describe, it} from 'mocha'`
// `bdd` interface only
// prettier-ignore
[
  'describe', 'context', 'it', 'specify',
  'xdescribe', 'xcontext', 'xit', 'xspecify',
  'before', 'beforeEach', 'afterEach', 'after'
].forEach(function (key) {
  mocha[key] = global[key];
});

module.exports = mocha;
