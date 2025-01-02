'use strict';

const escapeRegExp = require('escape-string-regexp');
const os = require('node:os');
const fs = require('fs-extra');
const {format} = require('node:util');
const path = require('node:path');
const Base = require('../../lib/reporters/base');
const debug = require('debug')('mocha:test:integration:helpers');

/**
 * Path to `mocha` executable
 */
const MOCHA_EXECUTABLE = require.resolve('../../bin/mocha');

/**
 * regular expression used for splitting lines based on new line / dot symbol.
 */
const SPLIT_DOT_REPORTER_REGEXP = new RegExp('[\\n' + Base.symbols.dot + ']+');

/**
 * Name of "default" fixture file.
 */
const DEFAULT_FIXTURE = '__default__';

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
  if (typeof args === 'function') {
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
    opts
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
  if (typeof args === 'function') {
    opts = done;
    done = args;
    args = [];
  }

  return invokeMocha(
    [...args, '--reporter', 'json', resolveFixturePath(fixturePath)],
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
              'Failed to parse JSON reporter output. Error:\n%O\nResult:\n%O',
              err,
              res
            )
          )
        );
      }
      done(null, result);
    },
    opts
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
      opts
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
      opts
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
    return {...JSON.parse(result.output), ...result};
  } catch (err) {
    throw new Error(
      `Couldn't parse JSON: ${err.message}\n\nOriginal result output: ${result.output}`
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
    '--no-color'
  ];
  if (!newArgs.some(arg => /--(no-)?bail/.test(arg))) {
    newArgs.push('--no-bail');
  }
  if (!newArgs.some(arg => /--(no-)?parallel/.test(arg))) {
    newArgs.push('--no-parallel');
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
  if (typeof args === 'function') {
    opts = done;
    done = args;
    args = [];
  }
  return createSubprocess(
    defaultArgs([MOCHA_EXECUTABLE].concat(args)),
    done,
    opts
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
      opts
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
  if (typeof args === 'function') {
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
 * @returns {import('child_process').ChildProcess}
 */
function createSubprocess(args, done, opts = {}) {
  let output = '';

  if (opts === 'pipe') {
    opts = {stdio: ['inherit', 'pipe', 'pipe']};
  }

  const env = {...process.env};
  // prevent DEBUG from borking STDERR when piping, unless explicitly set via `opts`
  delete env.DEBUG;

  opts = {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'inherit'],
    env,
    ...opts
  };

  /**
   * @type {import('child_process').ChildProcess}
   */
  let mocha;
  if (opts.fork) {
    const {fork} = require('node:child_process');
    // to use ipc, we need a fourth item in `stdio` array.
    // opts.stdio is usually an array of length 3, but it could be smaller
    // (pad with `null`)
    for (let i = opts.stdio.length; i < 4; i++) {
      opts.stdio.push(i === 3 ? 'ipc' : null);
    }
    debug('forking: %s', args.join(' '));
    mocha = fork(args[0], args.slice(1), opts);
  } else {
    const {spawn} = require('node:child_process');
    debug('spawning: %s', [process.execPath].concat(args).join(' '));
    mocha = spawn(process.execPath, args, opts);
  }

  const listener = data => {
    output += data;
  };

  mocha.stdout.on('data', listener);
  if (mocha.stderr) {
    mocha.stderr.on('data', listener);
  }
  mocha.on('error', done);

  mocha.on('close', code => {
    done(null, {
      output,
      code,
      args,
      command: args.join(' ')
    });
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
    path.extname(fixture) !== '.js' &&
    path.extname(fixture) !== '.mjs' &&
    path.extname(fixture) !== '.ts'
  ) {
    fixture += '.fixture.js';
  }
  return path.isAbsolute(fixture)
    ? fixture
    : path.resolve(__dirname, 'fixtures', fixture);
}

/**
 * Parses some `mocha` reporter output and returns a summary based on the "epilogue"
 * @param {string} res - Typically output of STDOUT from the 'spec' reporter
 * @returns {Summary}
 */
function getSummary(res) {
  return ['passing', 'pending', 'failing'].reduce((summary, type) => {
    const pattern = new RegExp(`  (\\d+) ${type}\\s`);
    const match = pattern.exec(res.output);
    summary[type] = match ? parseInt(match, 10) : 0;

    return summary;
  }, res);
}

/**
 * Runs the mocha executable in watch mode calls `change` and returns the
 * raw result.
 *
 * The function starts mocha with the given arguments and `--watch` and
 * waits until the first test run has completed. Then it calls `change`
 * and waits until the second test run has been completed. Mocha is
 * killed and the result is returned.
 *
 * On Windows, this will call `child_process.fork()` instead of `spawn()`.
 *
 * **Exit code will always be 0**
 * @param {string[]} args - Array of argument strings
 * @param {object|string} opts - If a `string`, then `cwd`, otherwise options for `child_process`
 * @param {Function} change - A potentially `Promise`-returning callback to execute which will change a watched file
 * @returns {Promise<RawResult>}
 */
async function runMochaWatchAsync(args, opts, change) {
  if (typeof opts === 'string') {
    opts = {cwd: opts};
  }
  opts = {
    sleepMs: 2000,
    stdio: ['pipe', 'pipe', 'inherit'],
    ...opts,
    fork: process.platform === 'win32'
  };
  const [mochaProcess, resultPromise] = invokeMochaAsync(
    [...args, '--watch'],
    opts
  );
  await sleep(opts.sleepMs);
  await change(mochaProcess);
  await sleep(opts.sleepMs);

  if (
    !(mochaProcess.connected
      ? mochaProcess.send('SIGINT')
      : mochaProcess.kill('SIGINT'))
  ) {
    throw new Error('failed to send signal to subprocess');
  }

  const res = await resultPromise;

  // we kill the process with `SIGINT`, so it will always appear as "failed" to our
  // custom assertions (a non-zero exit code 130). just change it to 0.
  res.code = 0;
  return res;
}

/**
 * Runs the mocha executable in watch mode calls `change` and returns the
 * JSON result.
 *
 * The function starts mocha with the given arguments and `--watch` and
 * waits until the first test run has completed. Then it calls `change`
 * and waits until the second test run has been completed. Mocha is
 * killed and the result is returned.
 *
 * On Windows, this will call `child_process.fork()` instead of `spawn()`.
 *
 * **Exit code will always be 0**
 * @param {string[]} args - Array of argument strings
 * @param {object|string} opts - If a `string`, then `cwd`, otherwise options for `child_process`
 * @param {Function} change - A potentially `Promise`-returning callback to execute which will change a watched file
 * @returns {Promise<JSONResult>}
 */
async function runMochaWatchJSONAsync(args, opts, change) {
  const res = await runMochaWatchAsync(
    [...args, '--reporter', 'json'],
    opts,
    change
  );
  return (
    res.output
      // eslint-disable-next-line no-control-regex
      .replace(/\u001b\[\?25./g, '')
      .split('\u001b[2K')
      .filter(x => x)
      .map(x => JSON.parse(x))
  );
}

const touchRef = new Date();

/**
 * Synchronously touch a file. Creates
 * the file and all its parent directories if necessary.
 *
 * @param {string} filepath - Path to file
 */
function touchFile(filepath) {
  fs.ensureDirSync(path.dirname(filepath));
  try {
    fs.utimesSync(filepath, touchRef, touchRef);
  } catch (e) {
    const fd = fs.openSync(filepath, 'a');
    fs.closeSync(fd);
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
  const contents = fs.readFileSync(filepath, 'utf-8');
  const newContents = contents.replace(pattern, replacement);
  fs.writeFileSync(filepath, newContents, 'utf-8');
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
  fs.ensureDirSync(path.dirname(dest));
  fs.copySync(fixtureSource, dest);
}

/**
 * Creates a temporary directory
 * @returns {Promise<CreateTempDirResult>} Temp dir path and cleanup function
 */
const createTempDir = async () => {
  const dirpath = await fs.mkdtemp(path.join(os.tmpdir(), 'mocha-'));
  return {
    dirpath,
    removeTempDir: async () => {
      if (!process.env.MOCHA_TEST_KEEP_TEMP_DIRS) {
        return fs.remove(dirpath);
      }
    }
  };
};

/**
 * Waits for `time` ms.
 * @param {number} time - Time in ms
 * @returns {Promise<void>}
 */
function sleep(time) {
  return new Promise(resolve => {
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
  touchFile
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
