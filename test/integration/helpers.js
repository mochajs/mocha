"use strict";

const os = require("node:os");
const fs = require("node:fs");
const fsP = require("node:fs/promises");
const { format } = require("node:util");
const path = require("node:path");
const { Base } = require("../../lib/reporters/base.mjs");
const { escapeRegExp } = require("../../lib/utils/regexp.mjs");
const debug = require("debug")("mocha:test:integration:helpers");
const SIGNAL_OFFSET = 128;

/**
 * Path to `mocha` executable
 */
const MOCHA_EXECUTABLE = require.resolve("../../bin/mocha.mjs");

/**
 * regular expression used for splitting lines based on new line / dot symbol.
 */
const SPLIT_DOT_REPORTER_REGEXP = new RegExp("[\\n" + Base.symbols.dot + "]+");

/**
 * Name of "default" fixture file.
 */
const DEFAULT_FIXTURE = "__default__";

/**
 * Path to "default" fixture file
 */
const DEFAULT_FIXTURE_PATH = resolveFixturePath(DEFAULT_FIXTURE);

/**
 * Invokes the mocha binary for the given fixture with color output disabled.
 * Accepts an array of additional command line args to pass. The callback is
 * invoked with a summary of the run, in addition to its output. The summary
 * includes the number of passing, pending, and failing tests, as well as the
 * exit code. Useful for testing different reporters.
 *
 * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
 * want it.
 * Example response:
 * {
 *   pending: 0,
 *   passing: 0,
 *   failing: 1,
 *   code:    1,
 *   output:  '...'
 * }
 *
 * @param {string} fixturePath - Path to fixture .js file
 * @param {string[]|SummarizedResultCallback} args - Extra args to mocha executable
 * @param {SummarizedResultCallback|Object} done - Callback
 * @param {Object} [opts] - Options for `spawn()`
 * @returns {ChildProcess} Subprocess process
 */
function runMocha(fixturePath, args, done, opts = {}) {
  if (typeof args === "function") {
    opts = done;
    done = args;
    args = [];
  }

  return invokeMocha(
    [...args, resolveFixturePath(fixturePath)],
    (err, res) => {
      if (err) {
        return done(err);
      }

      done(null, getSummary(res));
    },
    opts,
  );
}

/**
 * Invokes the mocha executable for the given fixture using the `json` reporter,
 * calling callback `done` with parsed output.
 *
 * Use when you expect `mocha` _not_ to fail (test failures OK); the output from
 * the `json` reporter--and thus the entire subprocess--must be valid JSON!
 *
 * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
 * want it.
 * @param {string} fixturePath - Path from `__dirname__`
 * @param {string[]|JSONResultCallback} args - Args to `mocha` or callback
 * @param {JSONResultCallback|Object} done - Callback or options
 * @param {Object} [opts] - Opts for `spawn()`
 * @returns {ChildProcess} Subprocess instance
 */
function runMochaJSON(fixturePath, args, done, opts) {
  if (typeof args === "function") {
    opts = done;
    done = args;
    args = [];
  }

  return invokeMocha(
    [...args, "--reporter", "json", resolveFixturePath(fixturePath)],
    (err, res) => {
      if (err) {
        return done(err);
      }

      let result;
      try {
        result = toJSONResult(res);
      } catch (err) {
        return done(
          new Error(
            format(
              "Failed to parse JSON reporter output. Error:\n%O\nResult:\n%O",
              err,
              res,
            ),
          ),
        );
      }
      done(null, result);
    },
    opts,
  );
}

/**
 *
 * If you need more granular control, try {@link invokeMochaAsync} instead.
 *
 * Like {@link runMocha}, but returns a `Promise`.
 * @param {string} fixturePath - Path to (or name of, or basename of) fixture file
 * @param {Options} [args] - Command-line arguments to the `mocha` executable
 * @param {Object} [opts] - Options for `child_process.spawn`.
 * @returns {Promise<Summary>}
 */
function runMochaAsync(fixturePath, args, opts) {
  return new Promise((resolve, reject) => {
    runMocha(
      fixturePath,
      args,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
      opts,
    );
  });
}

/**
 * Like {@link runMochaJSON}, but returns a `Promise`.
 * @param {string} fixturePath - Path to (or name of, or basename of) fixture file
 * @param {Options} [args] - Command-line args
 * @param {Object} [opts] - Options for `child_process.spawn`
 * @returns {Promise<JSONResult>}
 */
function runMochaJSONAsync(fixturePath, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    runMochaJSON(
      fixturePath,
      args,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
      opts,
    );
  });
}

/**
 * Coerce output as returned by _spawnMochaWithListeners using JSON reporter into a JSONResult as
 * recognized by our custom unexpected assertions
 * @param {RawResult} result - Raw stdout from Mocha run using JSON reporter
 * @returns {JSONResult}
 */
function toJSONResult(result) {
  try {
    return { ...JSON.parse(result.output), ...result };
  } catch (err) {
    throw new Error(
      `Couldn't parse JSON: ${err.message}\n\nOriginal result output: ${result.output}`,
      { cause: err },
    );
  }
}

/**
 * Creates arguments loading a default fixture if none provided
 *
 * - The `--no-color` arg is always used (color output complicates testing `STDOUT`)
 * - Unless `--bail` or `--no-bail` is set, use `--no-bail`.  This enables using
 *   `--bail` (if desired) from the command-line when running our integration
 *   test suites without stepping on the toes of subprocesses.
 * - Unless `--parallel` or `--no-parallel` is set, use `--no-parallel`.  We
 *   assume the test suite is _already_ running in parallel--and there's no point
 *   in trying to run a single test fixture in parallel.
 * - The {@link DEFAULT_FIXTURE} file is used if no arguments are provided.
 *
 * @param {string[]|*} [args] - Arguments to `spawn`
 * @returns {string[]}
 */
function defaultArgs(args = [DEFAULT_FIXTURE_PATH]) {
  const newArgs = [
    ...(!args.length ? [DEFAULT_FIXTURE_PATH] : args),
    "--no-color",
  ];
  if (!newArgs.some((arg) => /--(no-)?bail/.test(arg))) {
    newArgs.push("--no-bail");
  }
  if (!newArgs.some((arg) => /--(no-)?parallel/.test(arg))) {
    newArgs.push("--no-parallel");
  }
  return newArgs;
}

/**
 * Invoke `mocha` with default arguments. Calls `done` upon exit. Does _not_ accept a fixture path.
 *
 * Good for testing error conditions. This is low-level, and you likely want
 * {@link runMocha} or even {@link runMochaJSON} if you are running test fixtures.
 *
 * @param {string[]|RawResultCallback} args - Args to `mocha` or callback
 * @param {RawResultCallback|Object} done - Callback or options
 * @param {Object} [opts] - Options
 * @returns {ChildProcess}
 */
function invokeMocha(args, done, opts = {}) {
  if (typeof args === "function") {
    opts = done;
    done = args;
    args = [];
  }
  return createSubprocess(
    defaultArgs([MOCHA_EXECUTABLE].concat(args)),
    done,
    opts,
  );
}

/**
 * Invokes the mocha binary with the given arguments. Returns the
 * child process and a promise for the results of running the
 * command. The promise resolves when the child process exits. The
 * result includes the **raw** string output, as well as exit code.
 *
 * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
 * want it as part of the result output.
 *
 * @param {string[]} args - Array of args
 * @param {Object} [opts] - Opts for `spawn()`
 * @returns {[import('child_process').ChildProcess,Promise<RawResult>]} A tuple of process and result promise
 */
function invokeMochaAsync(args, opts = {}) {
  let mochaProcess;
  const resultPromise = new Promise((resolve, reject) => {
    mochaProcess = createSubprocess(
      defaultArgs([MOCHA_EXECUTABLE].concat(args)),
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
      opts,
    );
  });
  return [mochaProcess, resultPromise];
}

/**
 * Invokes subprocess with currently-running `node`.
 *
 * Useful for running certain fixtures as scripts.
 *
 * @param {string[]|RawResultCallback} args - Args to `mocha` or callback
 * @param {RawResultCallback|Object} done - Callback or options
 * @param {Object} [opts] - Options
 * @returns {ChildProcess}
 */
function invokeNode(args, done, opts = {}) {
  if (typeof args === "function") {
    opts = done;
    done = args;
    args = [];
  }
  return createSubprocess(args, done, opts);
}

/**
 * Creates a subprocess and calls callback `done` when it has exited.
 *
 * This is the most low-level function and should _not_ be exported.
 *
 * @param {string[]} args - Path to executable and arguments
 * @param {RawResultCallback} done - Callback
 * @param {Object|string} [opts] - Options to `child_process` or 'pipe' for shortcut to `{stdio: pipe}`
 * @param {boolean} [opts.fork] - If `true`, use `child_process.fork` instead
 * @param {boolean} [opts.separateStderr] - If `true`, accumulate piped `STDERR` into the result's `stderr` field instead of merging it into `output`
 * @returns {import('child_process').ChildProcess}
 */
function createSubprocess(args, done, opts = {}) {
  let output = "";
  let stderrOutput = "";

  if (opts === "pipe") {
    opts = { stdio: ["inherit", "pipe", "pipe"] };
  }

  const env = { ...process.env };
  // prevent DEBUG from borking STDERR when piping, unless explicitly set via `opts`
  delete env.DEBUG;

  opts = {
    cwd: process.cwd(),
    stdio: ["inherit", "pipe", "inherit"],
    env,
    ...opts,
  };

  /**
   * @type {import('child_process').ChildProcess}
   */
  let mocha;
  if (opts.fork) {
    const { fork } = require("node:child_process");
    // to use ipc, we need a fourth item in `stdio` array.
    // opts.stdio is usually an array of length 3, but it could be smaller
    // (pad with `null`)
    for (let i = opts.stdio.length; i < 4; i++) {
      opts.stdio.push(i === 3 ? "ipc" : null);
    }
    debug("forking: %s", args.join(" "));
    mocha = fork(args[0], args.slice(1), opts);
  } else {
    const { spawn } = require("node:child_process");
    debug("spawning: %s", [process.execPath].concat(args).join(" "));
    mocha = spawn(process.execPath, args, opts);
  }

  const listener = (data) => {
    output += data;
  };

  mocha.stdout.on("data", listener);
  if (mocha.stderr) {
    if (opts.separateStderr) {
      mocha.stderr.on("data", (data) => {
        stderrOutput += data;
      });
    } else {
      mocha.stderr.on("data", listener);
    }
  }
  mocha.on("error", done);

  mocha.on("close", (code) => {
    done(null, {
      output,
      stderr: stderrOutput,
      code,
      args,
      command: args.join(" "),
    });
  });

  /**
   * Emulate node's exit code for fatal signal. Allows tests to see the same
   * exit code as the mocha cli.
   */
  mocha.on("exit", (code, signal) => {
    if (signal) {
      mocha.exitCode =
        SIGNAL_OFFSET +
        (typeof signal == "string" ? os.constants.signals[signal] : signal);
    }
  });

  return mocha;
}

/**
 * Given a fixture "name" (a relative path from `${__dirname}/fixtures`),
 * with or without extension, or an absolute path, resolve a fixture filepath
 * @param {string} fixture - Fixture name
 * @returns {string} Resolved filepath
 */
function resolveFixturePath(fixture) {
  if (
    path.extname(fixture) !== ".js" &&
    path.extname(fixture) !== ".mjs" &&
    path.extname(fixture) !== ".ts"
  ) {
    fixture += ".fixture.js";
  }
  return path.isAbsolute(fixture)
    ? fixture
    : path.resolve(__dirname, "fixtures", fixture);
}

/**
 * Parses some `mocha` reporter output and returns a summary based on the "epilogue"
 * @param {string} res - Typically output of STDOUT from the 'spec' reporter
 * @returns {Summary}
 */
function getSummary(res) {
  return ["passing", "pending", "failing"].reduce((summary, type) => {
    const pattern = new RegExp(`  (\\d+) ${type}\\s`);
    const match = pattern.exec(res.output);
    summary[type] = match ? parseInt(match, 10) : 0;

    return summary;
  }, res);
}

/**
 * Marker printed to `STDERR` by mocha's watch mode (`lib/cli/watch-run.js`)
 * after every completed test run which did not already have a rerun
 * scheduled, including the very first run.
 */
const WATCH_RUN_MARKER = "[mocha] waiting for changes";

/**
 * Shared deadline for everything a single `runMochaWatchAsync` call waits
 * on. Suites using the watch helpers must keep their test timeouts above
 * this, so that the helper's diagnostic error wins the race against mocha's
 * own opaque timeout.
 */
const DEFAULT_WATCH_BUDGET_MS = 50000;

/**
 * Bounded window observed by "no rerun expected" tests between the change
 * and `SIGINT`: long enough for an erroneous rerun to begin
 */
const WATCH_NO_RERUN_GRACE_MS = 2000;

/**
 * How long to wait for the watch child to exit after `SIGINT` before
 * escalating to `SIGKILL`.
 */
const WATCH_EXIT_TIMEOUT_MS = 10000;

/**
 * How long to wait for the `close` event after `SIGKILL` is sent.  SIGKILL is
 * unignorable, so the OS delivers it almost instantly; this is just a safety
 * cap so {@link shutdownWatchChild} has a finite deadline.
 */
const WATCH_KILL_GRACE_MS = 2000;

/**
 * Parses the output of a `mocha --watch --reporter json` child into one
 * object per **completed** test run, ignoring a trailing segment which has
 * not fully arrived yet. Watch mode erases the line immediately before every rerun,
 * which delimits the segments.
 *
 * @param {string} output - Raw `STDOUT` of the watch child
 * @returns {object[]} One parsed JSON result per completed run
 */
function parseWatchJSONOutput(output) {
  return getJsonSegments(output)
    .map((segment) => {
      try {
        return JSON.parse(segment);
      } catch {
        // an incomplete segment still crossing the pipe
        return null;
      }
    })
    .filter((parsed) => parsed !== null);
}

/**
 * Returns non-empty segments from the watch child's `STDOUT` that cannot be
 * parsed as JSON. A non-empty unparseable segment means a run started but its
 * output was truncated (e.g. the child was killed mid-flush).
 *
 * @param {string} output - Raw `STDOUT` of the watch child
 * @returns {string[]} Segments that failed JSON.parse
 */
function getUnparsedSegments(output) {
  return getJsonSegments(output).filter((segment) => {
    try {
      JSON.parse(segment);
      return false;
    } catch {
      return true;
    }
  });
}

function getJsonSegments(output) {
  /** Pattern for CLI output hiding or showing the cursor */
  // eslint-disable-next-line no-control-regex
  const hideOrShowCursorRegex = /\u001b\[\?25./g;
  /** CLI output for erasing the current line */
  const lineErasureCliOutput = "\u001b[2K";
  return output
    .replace(hideOrShowCursorRegex, "")
    .split(lineErasureCliOutput)
    .filter(Boolean);
}

/**
 * Observes a `mocha --watch` child's output, letting callers wait until a
 * given number of test runs have verifiably completed instead of sleeping
 * and hoping (fixed sleeps lose the race on slow CI runners: a file change
 * made before the watcher is ready is ignored entirely, and killing the
 * child too early discards the final run).
 *
 * Two detectors are available:
 * - `json` counts fully parseable `--reporter json` payloads on `STDOUT`. A
 *   successful parse proves the run completed AND its output completely
 *   crossed the pipe, making it safe to `SIGINT` the child afterwards
 *   (killing the child can discard output it has not flushed yet).
 * - `marker` counts watch mode's "waiting for changes" `STDERR` messages,
 *   for tests using reporters other than `json`.
 *
 * @param {import('child_process').ChildProcess} mochaProcess - Watch child with piped stdio
 * @param {Object} opts - Options
 * @param {'json'|'marker'} opts.runDetector - How to count completed runs
 * @param {number} opts.budgetMs - Shared deadline for all waits of one helper call
 */
function createWatchRunObserver(mochaProcess, { runDetector, budgetMs }) {
  const deadlineAt = Date.now() + budgetMs;
  let stdout = "";
  let stderr = "";
  const waiters = new Set();

  const runCount = () =>
    runDetector === "json"
      ? parseWatchJSONOutput(stdout).length
      : stderr.split(WATCH_RUN_MARKER).length - 1;

  const evaluate = () => {
    for (const waiter of waiters) {
      if (waiter.isSatisfied()) {
        waiters.delete(waiter);
        clearTimeout(waiter.timer);
        waiter.resolve();
      }
    }
  };

  mochaProcess.stdout.on("data", (chunk) => {
    stdout += chunk;
    evaluate();
  });
  mochaProcess.stderr.on("data", (chunk) => {
    stderr += chunk;
    evaluate();
  });

  const waitFor = (isSatisfied, description) => {
    if (isSatisfied()) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const waiter = { isSatisfied, resolve };
      waiter.timer = setTimeout(
        () => {
          waiters.delete(waiter);
          reject(
            new Error(
              `runMochaWatchAsync: timed out waiting for ${description}; ` +
                `${runCount()} run(s) completed so far\n` +
                `=== watch child STDOUT ===\n${stdout}\n` +
                `=== watch child STDERR ===\n${stderr}`,
            ),
          );
        },
        Math.max(deadlineAt - Date.now(), 1),
      );
      waiters.add(waiter);
    });
  };

  return {
    runCount,
    waitForRuns: (n) =>
      waitFor(() => runCount() >= n, `watch run #${n} to complete`),
    waitForStderr: (pattern, description) =>
      waitFor(() => pattern.test(stderr), description),
  };
}

/**
 * Shuts a watch child down with `SIGINT` (sent as an IPC message when the
 * child was forked, as on Windows), escalating to `SIGKILL` if it has not
 * exited within {@link WATCH_EXIT_TIMEOUT_MS}, then waits for the `close`
 * event with a {@link WATCH_KILL_GRACE_MS} grace period so the total deadline
 * is always finite.
 *
 * @param {import('child_process').ChildProcess} mochaProcess - Watch child
 * @param {Promise<void>} closed - Resolves once the child has closed
 */
async function shutdownWatchChild(mochaProcess, closed) {
  if (mochaProcess.exitCode === null && mochaProcess.signalCode === null) {
    try {
      if (mochaProcess.connected) {
        mochaProcess.send("SIGINT");
      } else {
        mochaProcess.kill("SIGINT");
      }
    } catch {
      // the child exited in between; the bounded wait below settles it
    }
  }
  const killTimer = setTimeout(() => {
    try {
      mochaProcess.kill("SIGKILL");
    } catch {
      // already gone
    }
  }, WATCH_EXIT_TIMEOUT_MS);
  await Promise.race([
    closed,
    sleep(WATCH_EXIT_TIMEOUT_MS + WATCH_KILL_GRACE_MS),
  ]);
  clearTimeout(killTimer);
}

/**
 * Runs the mocha executable in watch mode, calls `change` and returns the
 * raw result.
 *
 * The function starts mocha with the given arguments and `--watch`, waits
 * until the first test run has verifiably completed (which also proves the
 * file watcher is ready), calls `change`, and waits until
 * `opts.expectedRuns` runs have completed in total. Mocha is then killed
 * and the result is returned.
 *
 * On Windows, this will call `child_process.fork()` instead of `spawn()`.
 *
 * **Exit code will always be 0**
 * @param {string[]} args - Array of argument strings
 * @param {object|string} opts - If a `string`, then `cwd`, otherwise options for `child_process` plus the watch options below
 * @param {number} [opts.expectedRuns] - Total completed runs (including the first) to wait for before killing mocha; defaults to `2`
 * @param {boolean} [opts.noRerun] - If `true`, expect NO rerun: observe a bounded grace period after `change` instead of waiting for a second run
 * @param {RegExp} [opts.firstRunCrashPattern] - If set, expect the first run to fail to load, printing only an error stack (no stdout) with a message matching this pattern. No countable run output to wait for.
 * @param {'json'|'marker'} [opts.runDetector] - How completed runs are counted; `runMochaWatchJSONAsync` sets `json`
 * @param {number} [opts.budgetMs] - Shared deadline for everything this call waits on; must stay below the test's timeout
 * @param {Function} change - A potentially `Promise`-returning callback which changes a watched file; receives the child process and `{waitForRuns}`
 * @returns {Promise<RawResult>}
 */
async function runMochaWatchAsync(args, opts, change) {
  if (typeof opts === "string") {
    opts = { cwd: opts };
  }
  const {
    expectedRuns = 2,
    noRerun = false,
    firstRunCrashPattern = null,
    runDetector = "marker",
    budgetMs = DEFAULT_WATCH_BUDGET_MS,
    ...spawnOpts
  } = opts;
  if (noRerun && opts.expectedRuns !== undefined) {
    throw new Error(
      "runMochaWatchAsync: `noRerun` and `expectedRuns` are mutually exclusive",
    );
  }
  opts = {
    stdio: ["pipe", "pipe", "pipe"],
    separateStderr: true,
    ...spawnOpts,
    fork: process.platform === "win32",
  };
  const [mochaProcess, resultPromise] = invokeMochaAsync(
    [...args, "--watch"],
    opts,
  );
  // avoid an unhandled rejection when a wait below throws first
  resultPromise.catch(() => {});
  const closed = new Promise((resolve) => {
    mochaProcess.once("close", resolve);
  });
  const observer = createWatchRunObserver(mochaProcess, {
    runDetector,
    budgetMs,
  });

  try {
    // The first watch run only starts inside chokidar's `ready` handler, and
    // file events from before then are ignored (`ignoreInitial` in
    // lib/cli/watch-run.js) -- so a completed first run proves the watcher
    // is armed and `change` cannot be lost. If watch mode ever starts the
    // first run before the watcher is ready (e.g. mochajs/mocha#5409), this
    // gate needs an explicit watcher-ready signal instead.
    if (firstRunCrashPattern) {
      await observer.waitForStderr(
        firstRunCrashPattern,
        "the first (crashing) watch run to print its error",
      );
    } else {
      await observer.waitForRuns(1);
    }

    await change(mochaProcess, {
      waitForRuns: observer.waitForRuns,
    });

    if (noRerun) {
      // the absence of a rerun cannot be awaited; give an erroneous rerun a
      // bounded window to show up, like the fixed sleep used historically
      await sleep(WATCH_NO_RERUN_GRACE_MS);
    } else {
      await observer.waitForRuns(expectedRuns);
    }
  } finally {
    await shutdownWatchChild(mochaProcess, closed);
  }

  const res = await resultPromise;

  if (noRerun && runDetector === "json" && !firstRunCrashPattern) {
    const unparsed = getUnparsedSegments(res.output);
    if (unparsed.length > 0) {
      throw new Error(
        `noRerun: ${unparsed.length} non-empty unparseable JSON segment(s) found ` +
          `after the grace period — an erroneous rerun was killed mid-flush\n` +
          `=== watch child STDOUT ===\n${res.output}`,
      );
    }
  }

  // we kill the process with `SIGINT`, so it will always appear as "failed" to our
  // custom assertions (a non-zero exit code 130). just change it to 0.
  res.code = 0;
  return res;
}

/**
 * Runs the mocha executable in watch mode, calls `change` and returns the
 * JSON result of every completed test run.
 *
 * See {@link runMochaWatchAsync} for the synchronization behavior and
 * options; completed runs are counted by parsing the json reporter's
 * output.
 *
 * **Exit code will always be 0**
 * @param {string[]} args - Array of argument strings
 * @param {object|string} opts - If a `string`, then `cwd`, otherwise options for {@link runMochaWatchAsync}
 * @param {Function} change - A potentially `Promise`-returning callback to execute which will change a watched file
 * @returns {Promise<JSONResult>}
 */
async function runMochaWatchJSONAsync(args, opts, change) {
  if (typeof opts === "string") {
    opts = { cwd: opts };
  }
  const res = await runMochaWatchAsync(
    [...args, "--reporter", "json"],
    { runDetector: "json", ...opts },
    change,
  );
  return parseWatchJSONOutput(res.output);
}

let lastTouchedTime = Date.now();

/**
 * Synchronously touch a file with a fresh, strictly-increasing mtime.
 * Creates the file and all its parent directories if necessary.
 *
 * Every touch gets its own mtime so that each one registers as a change on
 * every file-watcher backend; repeatedly setting an identical mtime is
 * invisible to polling watchers. Note that watchers may still coalesce
 * repeated touches of the same file made in very quick succession --
 * space them out in time.
 *
 * @param {string} filepath - Path to file
 */
function touchFile(filepath) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  lastTouchedTime = Math.max(lastTouchedTime + 1000, Date.now());
  const touchTime = new Date(lastTouchedTime);
  try {
    fs.utimesSync(filepath, touchTime, touchTime);
  } catch {
    const fd = fs.openSync(filepath, "a");
    fs.closeSync(fd);
    fs.utimesSync(filepath, touchTime, touchTime);
  }
}

/**
 * Synchronously replace all substrings matched by `pattern` with
 * `replacement` in the contents of file at `filepath`
 *
 * @param {string} filepath - Path to file
 * @param {RegExp|string} pattern - Search pattern
 * @param {string} replacement - Replacement
 */
function replaceFileContents(filepath, pattern, replacement) {
  const contents = fs.readFileSync(filepath, "utf-8");
  const newContents = contents.replace(pattern, replacement);
  fs.writeFileSync(filepath, newContents, "utf-8");
}

/**
 * Synchronously copy a fixture to the given destination file path.
 * Creates parent directories of the destination path if necessary.
 *
 * @param {string} fixtureName - Relative path from __dirname to fixture, or absolute path
 * @param {*} dest - Destination directory
 */
function copyFixture(fixtureName, dest) {
  const fixtureSource = resolveFixturePath(fixtureName);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(fixtureSource, dest);
}

/**
 * Creates a temporary directory
 * @returns {Promise<CreateTempDirResult>} Temp dir path and cleanup function
 */
const createTempDir = async () => {
  const dirpath = await fsP.mkdtemp(path.join(os.tmpdir(), "mocha-"));
  return {
    dirpath,
    removeTempDir: async () => {
      if (!process.env.MOCHA_TEST_KEEP_TEMP_DIRS) {
        return fs.rmSync(dirpath, { recursive: true, force: true });
      }
    },
  };
};

/**
 * Waits for `time` ms.
 * @param {number} time - Time in ms
 * @returns {Promise<void>}
 */
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

module.exports = {
  DEFAULT_FIXTURE,
  SPLIT_DOT_REPORTER_REGEXP,
  copyFixture,

  createTempDir,
  escapeRegExp,
  getSummary,
  invokeMocha,
  invokeMochaAsync,
  invokeNode,
  replaceFileContents,
  resolveFixturePath,
  runMocha,
  runMochaAsync,
  runMochaJSON,
  runMochaJSONAsync,
  runMochaWatchAsync,
  runMochaWatchJSONAsync,
  sleep,
  toJSONResult,
  touchFile,
};

/**
 * A summary of a `mocha` run
 * @typedef {Object} Summary
 * @property {number} passing - Number of passing tests
 * @property {number} pending - Number of pending tests
 * @property {number} failing - Number of failing tests
 */

/**
 * An unprocessed result from a `mocha` run
 * @typedef {Object} RawResult
 * @property {string} output - Process output; _usually_ just stdout
 * @property {number?} code - Exit code or `null` in some circumstances
 * @property {string[]} args - Array of program arguments
 * @property {string} command - Complete command executed
 * @property {string} stderr - Process stderr output
 */

/**
 * The result of a `mocha` run using `json` reporter
 * @typedef {Object} JSONResult
 * @property {Object} stats - Statistics
 * @property {Object[]} failures - Failure information
 * @property {number?} code - Exit code or `null` in some circumstances
 * @property {string} command - Complete command executed
 */

/**
 * The result of a `mocha` run using `spec` reporter (parsed)
 * @typedef {Summary} SummarizedResult
 * @property {string} output - Process output; _usually_ just stdout
 * @property {number?} code - Exit code or `null` in some circumstances
 */

/**
 * Callback function run when `mocha` process execution complete
 * @callback RawResultCallback
 * @param {Error?} err - Error, if any
 * @param {RawResult} result - Result of `mocha` run
 * @returns {void}
 */

/**
 * Callback function run when `mocha` process execution complete
 * @callback JSONResultCallback
 * @param {Error?} err - Error, if any
 * @param {JSONResult} result - Result of `mocha` run
 * @returns {void}
 */

/**
 * Callback function run when `mocha` process execution complete
 * @callback SummarizedResultCallback
 * @param {Error?} err - Error, if any
 * @param {SummarizedResult} result - Result of `mocha` run
 * @returns {void}
 */

/**
 * Return value when calling {@link createTempDir}
 *
 * @typedef {Object} CreateTempDirResult
 * @property {string} dirname - Path of new temp dir
 * @property {RemoveTempDirCallback} removeTempDir - "Cleanup" function to remove temp dir
 */

/**
 * Cleanup function to remove temp dir
 * @callback RemoveTempDirCallback
 * @returns {void}
 */
