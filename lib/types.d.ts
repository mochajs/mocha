/**
 * These types are a preliminary step towards moving Mocha's TypeScript types into Mocha.
 * They are not yet complete and are not yet fully used in the codebase.
 * For now, if you're an external user, you should use the types from @types/mocha.
 */

import type {FSWatcher, MatchFunction} from 'chokidar';

import type {constants} from './error-constants.js';
import type Mocha from './mocha.js';
import Runner from './runner.js';

/**
 * Command-line options
 */
export interface MochaOptions {
  /** Propagate uncaught errors? */
  allowUncaught?: boolean;

  /** Force `done` callback or promise? */
  asyncOnly?: boolean;

  /** Bail after first test failure? */
  bail?: boolean;

  /** Check for global variable leaks? */
  checkLeaks?: boolean;

  /** Color TTY output from reporter? */
  color?: boolean;

  /** Delay root suite execution? */
  delay?: boolean;

  /** Show diff on failure? */
  diff?: boolean;

  /** Report tests without running them? */
  dryRun?: boolean;

  /** Fail test run if tests were failed? */
  passOnFailingTestSuite?: boolean;

  /** Fail test run if zero tests? */
  failZero?: boolean;

  /** Test filter given string. */
  fgrep?: string;

  /** Tests marked `only` fail the suite? */
  forbidOnly?: boolean;

  /** Pending tests fail the suite? */
  forbidPending?: boolean;

  /** Full stacktrace upon failure? */
  fullTrace?: boolean;

  /** Variables expected in global scope. */
  global?: string[];

  /** Test filter given regular expression. */
  grep?: RegExp;

  /** Display inline diffs? */
  inlineDiffs?: boolean;

  /** Invert test filter matches? */
  invert?: boolean;

  /** Disable syntax highlighting? */
  noHighlighting?: boolean;

  /** Reporter name or constructor. */
  reporter?: string | Reporter;

  /** Reporter settings object. */
  reporterOption?: Object;

  /** Number of times to retry failed tests. */
  retries?: number;

  /** Slow threshold value, in milliseconds. */
  slow?: number;

  /** Timeout threshold value, in milliseconds. */
  timeout?: number | string;

  /** Interface name. */
  ui?: string;

  /** Run jobs in parallel. */
  parallel?: boolean;

  /** Max number of worker processes for parallel runs. */
  jobs?: number;

  /** Hooks to bootstrap the root suite with. */
  rootHooks?: MochaRootHookObject;

  /** Pathname of `rootHooks` plugin for parallel runs. */
  require?: string[];

  /** Should be `true` if `Mocha` process is running in a worker process. */
  isWorker?: boolean;

  watch?: boolean;
  extension?: string[];
  recursive?: boolean;
  sort?: boolean;
  file?: string[];
  spec?: string[];
  ignore?: string[];
}

/**
 * Callback to be invoked when test execution is complete.
 *
 * @private
 * @param failures - Number of failures that occurred.
 */
export type DoneCB = (failures?: number) => void;

export interface RunnerOptions {
  /** Files to run */
  files?: string[];
  /** Command-line options */
  options?: object;
}

/**
 * An alternative way to define root hooks that works with parallel runs.
 */
export interface MochaRootHookObject {
  /** "Before all" hook(s) */
  beforeAll?: Function | Function[];
  /** "Before each" hook(s) */
  beforeEach?: Function | Function[];
  /** "After all" hook(s) */
  afterAll?: Function | Function[];
  /** "After each" hook(s)} */
  afterEach?: Function | Function[];
}

/**
 * A function that's invoked _once_ which is either sync or async.
 * Can be a "teardown" or "setup".  These will all share the same context.
 */
export type MochaGlobalFixture = () => void | Promise<void>;

/**
 * An object making up all necessary parts of a plugin loader and aggregator
 */
export interface PluginDefinition {
  /**
   * Named export to use
   */
  exportName: string;
  /**
   * Option name for Mocha constructor (use `exportName` if omitted)
   */
  optionName?: string;
  /**
   * Validator function
   */
  validate?: PluginValidator;
  /**
   * Finalizer/aggregator function
   */
  finalize?: PluginFinalizer;
}

/**
 * A (sync) function to assert a user-supplied plugin implementation is valid.
 *
 * Defined in a {@link PluginDefinition}.

 * @param value Value to check
 * @this {PluginDefinition}
 */
export type PluginValidator = (this: PluginDefinition, value: unknown) => void;

/**
 * A function to finalize plugins implementations of a particular ilk
 * @param implementations User-supplied implementations
 */
export type PluginFinalizer = (
  implementations: unknown[]
) => Promise<unknown> | unknown;

/**
 * An object to configure how Mocha gathers test files
 */
export interface FileCollectionOptions {
  /** File extensions to use */
  extension?: string[];
  /** Files, dirs, globs to run */
  spec?: string[];
  /** Files, dirs, globs to ignore */
  ignore?: string[];
  /** List of additional files to include */
  file?: string[];
  /** Find files recursively */
  recursive?: boolean;
  /** Sort test files */
  sort?: boolean;
}

/**
 * Diagnostic object containing unmatched files
 */
export interface UnmatchedFile {
  /** The absolute path to the file */
  absolutePath: string;
  /** A list of unmatched files derived from the file arguments passed in */
  pattern: string;
}

/**
 * Response object containing a list of files to test and unmatched files.
 */
export interface FileCollectionResponse {
  /** A list of files to test */
  files: string[];
  /** A list of unmatched files derived from the file arguments passed in */
  unmatchedFiles: UnmatchedFile[];
}

/**
 * @private
 */
export interface BeforeWatchRunOptions {
  mocha: Mocha;
  watcher: FSWatcher;
}

/**
 * Callback to be run before `mocha.run()` is called.
 * Optionally, it can return a new `Mocha` instance.
 * @private
 */
export type BeforeWatchRun = (options: BeforeWatchRunOptions) => Mocha;

/**
 * Object containing run control methods
 * @private
 */
export interface Rerunner {
  /** Calls `mocha.run()` */
  run: Function;
  /** Schedules another call to `run */
  scheduleRun: Function;
}

/**
 * Object containing paths (without globs) and glob paths for matching.
 * @private
 */
export interface PathPattern {
  /** Set of absolute paths without globs. */
  paths: Set<string>;
  /** Set of absolute glob paths. */
  globs: Set<string>;
}

/**
 * Object containing path patterns for filtering from the provided glob paths.
 * @private
 */
export interface PathFilter {
  /** Path patterns for directories. */
  dir: PathPattern;
  /** Path patterns for matching. */
  match: PathPattern;
}

/**
 * Checks if the file path matches the allowed patterns.
 * @private
 * @param filePath The file path to check.
 * @returns Determines if there was a match.
 */
export type AllowMatchFunction = (filePath: string) => boolean;

/**
 * Object for matching paths to either allow or ignore them.
 * @private
 */
export interface PathMatcher {
  /** Checks if the file path matches the allowed patterns. */
  allow: AllowMatchFunction;
  /** The Chokidar `ignored` match function. */
  ignore: MatchFunction;
}

export interface StatsCollector {
  /** integer count of suites run */
  suites: number;

  /** integer count of tests run */
  tests: number;

  /** integer count of passing tests */
  passes: number;

  /** integer count of pending tests */
  pending: number;

  /** integer count of failed tests */
  failures: number;

  /** time when testing began */
  start: Date;

  /** time when testing concluded */
  end: Date;

  /** number of msecs that testing took */
  duration: number;
}

export interface PluginLoaderOptions {
  /**
   * Plugin definitions
   */
  pluginDefs?: PluginDefinition;

  /**
   * A list of plugins to ignore when loading
   */
  ignore?: string[];
}

/**
 * @memberof module:lib/errors
 */
export interface MochaTimeoutError extends Error {
  code: typeof constants.TIMEOUT;

  /**
   * Timeout in ms
   */
  timeout?: number;

  /**
   * Filepath, if given
   */
  file?: string;
}

/**
 * The result of calling `SerializableEvent.serialize`, as received
 * by the deserializer.
 * @private
 */
export interface SerializedEvent {
  /** Optional serialized data */
  data?: object;

  /** Optional serialized `Error` */
  error?: Error;
}

/**
 * The result of calling `SerializableWorkerResult.serialize` as received
 * by the deserializer.
 * @private
 */
export interface SerializedWorkerResult {
  /** Number of failures */
  failureCount: number;

  /** Serialized events */
  events: SerializedEvent[];

  /** Symbol-like to denote the type of object this is */
  __type: 'SerializedWorkerResult';
}

/**
 * Listener function intended to be bound to `Process.SIGINT` event
 * @private
 */
export type SigIntListener = () => Promise<void>;

/**
 * A function accepting a test file path and returning the results of a test run
 * @private
 * @param filename - File to run
 */
export type FileRunner = (filename: string) => Promise<SerializedWorkerResult>;

/**
 * Serializable event data from a `Runner`.  Keys of the `data` property
 * beginning with `__` will be converted into a function which returns the value
 * upon deserialization.
 */
export interface BufferedEvent {
  /** Event name */
  name: string;

  /** Event parameters */
  data: object;
}

/**
 * An object with all stack traces recursively mounted from each err.cause
 * @memberof module:lib/reporters/base
 */
export interface FullErrorStack {
  message: string;
  msg: string;
  stack: string;
}

export interface Reporter {
  new (runner: Runner, options: MochaOptions): Reporter;
  done?: (failures: number, callback: () => void) => void;
}
