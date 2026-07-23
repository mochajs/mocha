"use strict";

/**
 * Metadata about various options of the `run` command
 * @see module:lib/cli/run
 * @module
 * @private
 */

/**
 * Dictionary of option types to list of options having said type
 * @type {Record<string, string[]>}
 * @private
 */
const types = {
  array: [
    "extension",
    "file",
    "global",
    "ignore",
    "node-option",
    "reporter-option",
    "require",
    "spec",
    "watch-files",
    "watch-ignore",
  ],
  boolean: [
    "allow-uncaught",
    "async-only",
    "bail",
    "check-leaks",
    "clear-screen",
    "color",
    "delay",
    "diff",
    "dry-run",
    "exit",
    "fail-hook-affected-tests",
    "pass-on-failing-test-suite",
    "fail-zero",
    "forbid-only",
    "forbid-pending",
    "full-trace",
    "inline-diffs",
    "invert",
    "list-interfaces",
    "list-reporters",
    "no-colors",
    "parallel",
    "posix-exit-codes",
    "recursive",
    "sort",
    "watch",
  ],
  number: ["retries", "jobs"],
  string: [
    "config",
    "fgrep",
    "grep",
    "package",
    "reporter",
    "ui",
    "slow",
    "timeout",
  ],
};

/**
 * Option aliases keyed by canonical option name.
 * Arrays used to reduce
 * @type {Record<string, string[]>}
 * @private
 */
const aliases = {
  "async-only": ["A"],
  bail: ["b"],
  color: ["c", "colors"],
  fgrep: ["f"],
  global: ["globals"],
  grep: ["g"],
  ignore: ["exclude"],
  invert: ["i"],
  jobs: ["j"],
  "no-colors": ["C"],
  "node-option": ["n"],
  parallel: ["p"],
  reporter: ["R"],
  "reporter-option": ["reporter-options", "O"],
  require: ["r"],
  slow: ["s"],
  sort: ["S"],
  timeout: ["t", "timeouts"],
  ui: ["u"],
  watch: ["w"],
};

const descriptions = {
  "allow-uncaught": "Allow uncaught errors to propagate",
  "async-only":
    "Require all tests to use a callback (async) or return a Promise",
  bail: 'Abort ("bail") after first test failure',
  "check-leaks": "Check for global variable leaks",
  color: "Force-enable color output",
  config: "Path to config file",
  delay: "Delay initial execution of root suite",
  diff: "Show diff on failure",
  "dry-run": "Report tests without executing them",
  exit: "Force Mocha to quit after tests complete",
  extension: "File extension(s) to load",
  "fail-hook-affected-tests":
    "Report tests as failed when affected by hook failures (before/beforeEach)",
  "fail-zero": "Fail test run if no test(s) encountered",
  "pass-on-failing-test-suite": "Not fail test run if tests were failed",
  fgrep: "Only run tests containing this string",
  file: "Specify file(s) to be loaded prior to root suite execution",
  "forbid-only": "Fail if exclusive test(s) encountered",
  "forbid-pending": "Fail if pending test(s) encountered",
  "full-trace": "Display full stack traces",
  global: "List of allowed global variables",
  grep: "Only run tests matching this string or regexp",
  ignore: "Ignore file(s) or glob pattern(s)",
  "inline-diffs":
    "Display actual/expected differences inline within each string",
  invert: "Inverts --grep and --fgrep matches",
  jobs: "Number of concurrent jobs for --parallel; use 1 to run in serial",
  "list-interfaces": "List built-in user interfaces & exit",
  "list-reporters": "List built-in reporters & exit",
  "no-colors": "Force-disable color output",
  "node-option": 'Node or V8 option (no leading "--")',
  package: "Path to package.json for config",
  parallel: "Run tests in parallel",
  "posix-exit-codes":
    "Use POSIX and UNIX shell exit codes as Mocha's return value",
  recursive: "Look for tests in subdirectories",
  reporter: "Specify reporter to use",
  "reporter-option": "Reporter-specific options (<k=v,[k1=v1,..]>)",
  require: "Require module",
  retries: "Retry failed tests this many times",
  slow: 'Specify "slow" test threshold (in milliseconds)',
  sort: "Sort test files",
  timeout: "Specify test timeout threshold (in milliseconds)",
  ui: "Specify user interface",
  watch: "Watch files in the current working directory for changes",
  "watch-files": "List of paths or globs to watch",
  "watch-ignore": "List of paths or globs to exclude from watching",
};

const getRunOptionDefinitions = () =>
  Object.entries(types).flatMap(([type, names]) =>
    names.map((name) => ({
      name,
      type,
      aliases: aliases[name] || [],
      description: descriptions[name] || "",
    })),
  );

const ALL_MOCHA_FLAGS = Object.keys(types).reduce((acc, key) => {
  // gets all flags from each of the fields in `types`, adds those,
  // then adds aliases of each flag (if any)
  types[key].forEach((flag) => {
    acc.add(flag);
    const flagAliases = aliases[flag] || [];
    flagAliases.forEach((alias) => {
      acc.add(alias);
    });
  });
  return acc;
}, new Set());

/**
 * Returns `true` if the provided `flag` is known to Mocha.
 * @param {string} flag - Flag to check
 * @returns {boolean} If `true`, this is a Mocha flag
 * @private
 */
const isMochaFlag = (flag) => {
  return ALL_MOCHA_FLAGS.has(flag.replace(/^--?/, ""));
};

/**
 * Returns expected yarg option type for a given mocha flag.
 * @param {string} flag - Flag to check (can be with or without leading dashes "--"")
 * @returns {string | undefined} - If flag is a valid mocha flag, the expected type of argument for this flag is returned, otherwise undefined is returned.
 * @private
 */
const expectedTypeForFlag = (flag) => {
  const normalizedName = flag.replace(/^--?/, "");

  // If flag is an alias, get it's full name.
  const fullFlagName =
    Object.keys(aliases).find((flagName) =>
      aliases[flagName].includes(normalizedName),
    ) || normalizedName;

  return Object.keys(types).find((flagType) =>
    types[flagType].includes(fullFlagName),
  );
};

exports.types = types;
exports.aliases = aliases;
exports.getRunOptionDefinitions = getRunOptionDefinitions;
exports.isMochaFlag = isMochaFlag;
exports.expectedTypeForFlag = expectedTypeForFlag;
