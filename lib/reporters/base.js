/**
 * @typedef {import('../runner.cjs')} Runner
 * @typedef {import('../test.js')} Test
 * @typedef {import('../types.d.ts').FullErrorStack} FullErrorStack
 */

/**
 * @module Base
 */
/**
 * Module dependencies.
 */

import * as diff from "diff";
import milliseconds from "ms";
import utils from "../utils.cjs";
import supportsColor from "supports-color";
import Runner from "../runner.cjs";

const { constants } = Runner;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;

const isBrowser = utils.isBrowser();

function getBrowserWindowSize() {
  if ("innerHeight" in global) {
    return [global.innerHeight, global.innerWidth];
  }
  // In a Web Worker, the DOM Window is not available.
  return [640, 480];
}

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = isBrowser || (process.stdout.isTTY && process.stderr.isTTY);

/**
 * Save log references to avoid tests interfering (see GH-3604).
 */
var consoleLog = console.log;

/**
 * @abstract
 * @description
 * All other reporters generally inherit from this reporter.
 */
export class Base {
  /**
   * Constructs a new `Base` reporter instance.
   *
   * @public
   * @memberof Mocha.reporters
   * @param {Runner} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options) {
    var failures = (this.failures = []);

    if (!runner) {
      throw new TypeError("Missing runner argument");
    }
    this.options = options || {};
    this.runner = runner;
    this.stats = runner.stats; // assigned so Reporters keep a closer reference

    var maxDiffSizeOpt =
      this.options.reporterOption && this.options.reporterOption.maxDiffSize;
    if (maxDiffSizeOpt !== undefined && !isNaN(Number(maxDiffSizeOpt))) {
      Base.maxDiffSize = Number(maxDiffSizeOpt);
    }

    runner.on(EVENT_TEST_PASS, function (test) {
      if (test.duration > test.slow()) {
        test.speed = "slow";
      } else if (test.duration > test.slow() / 2) {
        test.speed = "medium";
      } else {
        test.speed = "fast";
      }
    });

    runner.on(EVENT_TEST_FAIL, function (test, err) {
      if (Base.showDiff(err)) {
        stringifyDiffObjs(err);
      }
      // more than one error per test
      if (test.err && err instanceof Error) {
        test.err.multiple = (test.err.multiple || []).concat(err);
      } else {
        test.err = err;
      }
      failures.push(test);
    });
  }

  /**
   * Outputs common epilogue used by many of the bundled reporters.
   *
   * @public
   * @memberof Mocha.reporters
   */
  epilogue() {
    var stats = this.stats;
    var fmt;

    Base.consoleLog();

    // passes
    fmt =
      Base.color("bright pass", " ") +
      Base.color("green", " %d passing") +
      Base.color("light", " (%s)");

    Base.consoleLog(fmt, stats.passes || 0, milliseconds(stats.duration));

    // pending
    if (stats.pending) {
      fmt = Base.color("pending", " ") + Base.color("pending", " %d pending");

      Base.consoleLog(fmt, stats.pending);
    }

    // failures
    if (stats.failures) {
      fmt = Base.color("fail", "  %d failing");

      Base.consoleLog(fmt, stats.failures);

      Base.list(this.failures);
      Base.consoleLog();
    }

    Base.consoleLog();
  }
}

Base.consoleLog = consoleLog;

Base.abstract = true;

/**
 * Enable coloring by default, except in the browser interface.
 */
Base.useColors =
  !isBrowser &&
  (supportsColor.stdout || process.env.MOCHA_COLORS !== undefined);

/**
 * Inline diffs instead of +/-
 */

Base.inlineDiffs = false;

/**
 * Truncate diffs longer than this value to avoid slow performance
 */
Base.maxDiffSize = 8192;

/**
 * Default color map.
 */

Base.colors = {
  pass: 90,
  fail: 31,
  "bright pass": 92,
  "bright fail": 91,
  "bright yellow": 93,
  pending: 36,
  suite: 0,
  "error title": 0,
  "error message": 31,
  "error stack": 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  "diff gutter": 90,
  "diff added": 32,
  "diff removed": 31,
  "diff added inline": "30;42",
  "diff removed inline": "30;41",
};

/**
 * Default symbol map.
 */

Base.symbols = {
  ok: utils.logSymbols.success,
  err: utils.logSymbols.error,
  dot: ".",
  comma: ",",
  bang: "!",
};

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @private
 * @param {string} type
 * @param {string} str
 * @return {string}
 */
Base.color = function (type, str) {
  if (!Base.useColors) {
    return String(str);
  }
  return "\u001b[" + Base.colors[type] + "m" + str + "\u001b[0m";
};

/**
 * Expose term window size, with some defaults for when stderr is not a tty.
 */

Base.window = {
  width: 75,
};

if (isatty) {
  if (isBrowser) {
    Base.window.width = getBrowserWindowSize()[1];
  } else {
    Base.window.width = process.stdout.getWindowSize(1)[0];
  }
}

/**
 * Expose some basic cursor interactions that are common among reporters.
 */

Base.cursor = {
  hide: function () {
    isatty && process.stdout.write("\u001b[?25l");
  },

  show: function () {
    isatty && process.stdout.write("\u001b[?25h");
  },

  deleteLine: function () {
    isatty && process.stdout.write("\u001b[2K");
  },

  beginningOfLine: function () {
    isatty && process.stdout.write("\u001b[0G");
  },

  CR: function () {
    if (isatty) {
      Base.cursor.deleteLine();
      Base.cursor.beginningOfLine();
    } else {
      process.stdout.write("\r");
    }
  },
};

Base.showDiff = function (err) {
  return (
    err &&
    err.showDiff !== false &&
    sameType(err.actual, err.expected) &&
    err.expected !== undefined
  );
};

/**
 * Estimate the serialized size of a value.
 * Returns -1 if the value is too complex to estimate safely.
 *
 * @private
 * @param {*} val
 * @param {number} maxDepth
 * @param {Set<*>} [seen]
 * @returns {number}
 */
function estimateSize(val, maxDepth, seen) {
  if (maxDepth <= 0) return -1;

  seen = seen || new Set();

  const type = typeof val;
  if (type === "string") return val.length;
  if (type === "number" || type === "boolean") return 8;
  if (val === null || val === undefined) return 4;

  // Avoid circular references
  if (type === "object") {
    if (seen.has(val)) return -1;
    seen.add(val);

    // Special handling for Buffers - they can be massive
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(val)) {
      return val.length > 10000 ? -1 : val.length * 2;
    }

    let size = 2; // {} or []
    try {
      const keys = Object.keys(val);
      if (keys.length > 1000) return -1; // Too many keys

      for (const key of keys) {
        const childSize = estimateSize(val[key], maxDepth - 1, seen);
        if (childSize === -1) return -1;
        size += key.length + childSize + 4; // key + value + formatting
        if (size > 100000) return -1; // Bail early if getting huge
      }
    } catch {
      return -1;
    }

    seen.delete(val);
    return size;
  }

  return 50; // Default estimate for other types
}

function stringifyDiffObjs(err) {
  if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
    // Estimate size before stringifying to avoid hangs
    const maxSafeSize = Base.maxDiffSize || 8192;
    const actualSize = estimateSize(err.actual, 10);
    const expectedSize = estimateSize(err.expected, 10);

    if (
      actualSize === -1 ||
      expectedSize === -1 ||
      actualSize > maxSafeSize ||
      expectedSize > maxSafeSize
    ) {
      // Values too large/complex - provide safe fallback
      err.actual = "[object too large to diff]";
      err.expected = "[object too large to diff]";
      return;
    }

    err.actual = utils.stringify(err.actual);
    err.expected = utils.stringify(err.expected);
  }
}

/**
 * Returns a diff between 2 strings with coloured ANSI output.
 *
 * @description
 * The diff will be either inline or unified dependent on the value
 * of `Base.inlineDiff`.
 *
 * @param {string} actual
 * @param {string} expected
 * @return {string} Diff
 */

Base.generateDiff = function (actual, expected) {
  try {
    var maxLen = Base.maxDiffSize;
    var skipped = 0;
    if (maxLen > 0) {
      skipped = Math.max(actual.length - maxLen, expected.length - maxLen);
      actual = actual.slice(0, maxLen);
      expected = expected.slice(0, maxLen);
    }
    let result = Base.inlineDiffs
      ? inlineDiff(actual, expected)
      : unifiedDiff(actual, expected);
    if (skipped > 0) {
      result = `${result}\n      [mocha] output truncated to ${maxLen} characters, see "maxDiffSize" reporter-option\n`;
    }
    return result;
  } catch {
    var msg =
      "\n      " +
      Base.color("diff added", "+ expected") +
      " " +
      Base.color("diff removed", "- actual:  failed to generate Mocha diff") +
      "\n";
    return msg;
  }
};

/**
 * Traverses err.cause and returns all stack traces
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} [seen]
 * @return {FullErrorStack}
 */
var getFullErrorStack = function (err, seen) {
  if (seen && seen.has(err)) {
    return { message: "", msg: "<circular>", stack: "" };
  }

  var message;
  var usedInspect = false;

  if (typeof err.inspect === "function") {
    message = err.inspect() + "";
    usedInspect = true;
  } else if (err.message && typeof err.message.toString === "function") {
    message = err.message + "";
  } else {
    message = "";
  }

  var rawStack = err.stack || message;
  var lines = rawStack.split("\n");
  var lastLine = lines.length - 1;
  while (lastLine >= 0 && lines[lastLine] === "") {
    lastLine--;
  }
  var frameStart = lastLine + 1;
  for (var i = lastLine; i >= 0; i--) {
    if (/^\s+at\s/.test(lines[i])) {
      frameStart = i;
    } else {
      break;
    }
  }

  var msg;
  var stack;
  var splitSucceeded = false;
  if (frameStart <= lastLine) {
    stack = lines.slice(frameStart, lastLine + 1).join("\n");
    msg =
      usedInspect || frameStart === 0
        ? message
        : lines.slice(0, frameStart).join("\n");
    splitSucceeded = true;
  } else {
    var index = message ? rawStack.indexOf(message) : -1;
    if (index === -1) {
      msg = message;
      stack = rawStack;
    } else {
      index += message.length;
      msg = rawStack.slice(0, index);
      stack = rawStack.slice(index + 1);
      splitSucceeded = true;
    }
  }

  if (splitSucceeded && err.cause) {
    seen = seen || new Set();
    seen.add(err);
    const causeStack = getFullErrorStack(err.cause, seen);
    stack +=
      "\n   Caused by: " +
      causeStack.msg +
      (causeStack.stack ? "\n" + causeStack.stack : "");
  }

  return {
    message,
    msg,
    stack,
  };
};

/**
 * Outputs the given `failures` as a list.
 *
 * @public
 * @memberof Mocha.reporters.Base
 * @variation 1
 * @param {Object[]} failures - Each is Test instance with corresponding
 *     Error property
 */
Base.list = function (failures) {
  var multipleErr, multipleTest;
  Base.consoleLog();
  failures.forEach(function (test, i) {
    // format
    var fmt =
      Base.color("error title", "  %s) %s:\n") +
      Base.color("error message", "     %s") +
      Base.color("error stack", "\n%s\n");

    // msg
    var err;
    if (test.err && test.err.multiple) {
      if (multipleTest !== test) {
        multipleTest = test;
        multipleErr = [test.err].concat(test.err.multiple);
      }
      err = multipleErr.shift();
    } else {
      err = test.err;
    }

    var { message, msg, stack } = getFullErrorStack(err);

    // uncaught
    if (err.uncaught) {
      msg = "Uncaught " + msg;
    }
    // explicitly show diff
    if (!Base.hideDiff && Base.showDiff(err)) {
      stringifyDiffObjs(err);
      fmt =
        Base.color("error title", "  %s) %s:\n%s") +
        Base.color("error stack", "\n%s\n");
      var match = message.match(/^([^:]+): expected/);
      msg = "\n      " + Base.color("error message", match ? match[1] : msg);

      msg += Base.generateDiff(err.actual, err.expected);
    }

    // indent stack trace
    stack = stack.replace(/^/gm, "  ");

    // indented test title
    var testTitle = "";
    test.titlePath().forEach(function (str, index) {
      if (index !== 0) {
        testTitle += "\n     ";
      }
      for (var i = 0; i < index; i++) {
        testTitle += "  ";
      }
      testTitle += str;
    });

    Base.consoleLog(fmt, i + 1, testTitle, msg, stack);
  });
};

/**
 * Pads the given `str` to `len`.
 *
 * @private
 * @param {string} str
 * @param {string} len
 * @return {string}
 */
function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(" ") + str;
}

/**
 * Returns inline diff between 2 strings with coloured ANSI output.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} Diff
 */
function inlineDiff(actual, expected) {
  var msg = errorDiff(actual, expected);

  // linenos
  var lines = msg.split("\n");
  if (lines.length > 4) {
    var width = String(lines.length).length;
    msg = lines
      .map(function (str, i) {
        return pad(i + 1, width) + " |" + " " + str;
      })
      .join("\n");
  }

  // legend
  msg =
    "\n" +
    Base.color("diff removed inline", "actual") +
    " " +
    Base.color("diff added inline", "expected") +
    "\n\n" +
    msg +
    "\n";

  // indent
  msg = msg.replace(/^/gm, "      ");
  return msg;
}

/**
 * Returns unified diff between two strings with coloured ANSI output.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} The diff.
 */
function unifiedDiff(actual, expected) {
  var indent = "      ";
  function cleanUp(line) {
    if (line[0] === "+") {
      return indent + colorLines("diff added", line);
    }
    if (line[0] === "-") {
      return indent + colorLines("diff removed", line);
    }
    if (line.match(/@@/)) {
      return "--";
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return indent + line;
  }
  function notBlank(line) {
    return typeof line !== "undefined" && line !== null;
  }
  var msg = diff.createPatch("string", actual, expected);
  var lines = msg.split("\n").splice(5);
  return (
    "\n      " +
    colorLines("diff added", "+ expected") +
    " " +
    colorLines("diff removed", "- actual") +
    "\n\n" +
    lines.map(cleanUp).filter(notBlank).join("\n")
  );
}

/**
 * Returns character diff for `err`.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} the diff
 */
function errorDiff(actual, expected) {
  return diff
    .diffWordsWithSpace(actual, expected)
    .map(function (str) {
      if (str.added) {
        return colorLines("diff added inline", str.value);
      }
      if (str.removed) {
        return colorLines("diff removed inline", str.value);
      }
      return str.value;
    })
    .join("");
}

/**
 * Colors lines for `str`, using the color `name`.
 *
 * @private
 * @param {string} name
 * @param {string} str
 * @return {string}
 */
function colorLines(name, str) {
  return str
    .split("\n")
    .map(function (str) {
      return Base.color(name, str);
    })
    .join("\n");
}

/**
 * Object#toString reference.
 */
var objToString = Object.prototype.toString;

/**
 * Checks that a / b have the same type.
 *
 * @private
 * @param {Object} a
 * @param {Object} b
 * @return {boolean}
 */
function sameType(a, b) {
  return objToString.call(a) === objToString.call(b);
}
