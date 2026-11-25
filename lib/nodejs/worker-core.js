/**
 * Worker runtime helpers for parallel mode.
 * @module worker-core
 * @private
 */

import debugModule from "debug";
import Mocha from "../mocha.cjs";
import { handleRequires, validateLegacyPlugin } from "../cli/run-helpers.js";
import {
  createInvalidArgumentTypeError,
  createInvalidArgumentValueError,
} from "../errors.js";
import { serialize } from "./serializer.js";
import workerpool from "workerpool";

/**
 * @typedef {import('../types.d.ts').BufferedEvent} BufferedEvent
 * @typedef {import('../types.d.ts').MochaOptions} MochaOptions
 */

const { setInterval, clearInterval } = global;

const debug = debugModule(`mocha:parallel:worker:${process.pid}`);
const isDebugEnabled = debugModule.enabled(
  `mocha:parallel:worker:${process.pid}`,
);

/**
 * Factory to create workers.
 * Param should only be used for testing.
 * @returns A worker ready to be added to a pool and started.
 */
const createWorker = ({
  // This param object has a prop named Mocha.
  // We assign that prop to our existing Mocha value by default.
  // To disambiguate, we alias the prop as MochaImpl.
  // Same for other "___Impl" props
  Mocha: MochaImpl = Mocha,
  handleRequires: handleRequiresImpl = handleRequires,
  serialize: serializeImpl = serialize,
  validateLegacyPlugin: validateLegacyPluginImpl = validateLegacyPlugin,
} = {}) => {
  let rootHooks;

  /**
   * Initializes some stuff on the first call to {@link run}.
   *
   * Handles `--require` and `--ui`.  Does _not_ handle `--reporter`,
   * as only the `Buffered` reporter is used.
   *
   * **This function only runs once per worker**; it overwrites itself with a no-op
   * before returning.
   *
   * @param {MochaOptions} argv - Command-line options
   */
  let bootstrap = async (argv) => {
    // globalSetup and globalTeardown do not run in workers
    const plugins = await handleRequiresImpl(argv.require, {
      ignoredPlugins: ["mochaGlobalSetup", "mochaGlobalTeardown"],
    });
    validateLegacyPluginImpl(argv, "ui", MochaImpl.interfaces);

    rootHooks = plugins.rootHooks;
    bootstrap = () => {};
    debug("bootstrap(): finished with args: %O", argv);
  };

  /**
   * Runs a single test file in a worker process.
   * @param {string} filepath - Filepath of test file
   * @param {string} [serializedOptions] - **Serialized** options. This string will be eval'd!
   * @see https://npm.im/serialize-javascript
   * @returns {Promise<{failures: number, events: BufferedEvent[]}>} - Test
   * failure count and list of events.
   */
  async function run(filepath, serializedOptions = "{}") {
    if (!filepath) {
      throw createInvalidArgumentTypeError(
        'Expected a non-empty "filepath" argument',
        "filepath",
        "string",
      );
    }

    debug("run(): running test file %s", filepath);

    if (typeof serializedOptions !== "string") {
      throw createInvalidArgumentTypeError(
        "run() expects second parameter to be a string which was serialized by the `serialize-javascript` module",
        "serializedOptions",
        "string",
      );
    }
    let argv;
    try {
      argv = eval("(" + serializedOptions + ")");
    } catch {
      throw createInvalidArgumentValueError(
        "run() was unable to deserialize the options",
        "serializedOptions",
        serializedOptions,
      );
    }

    const opts = Object.assign({ ui: "bdd" }, argv, {
      // if this was true, it would cause infinite recursion.
      parallel: false,
      // this doesn't work in parallel mode
      forbidOnly: true,
      // it's useful for a Mocha instance to know if it's running in a worker process.
      isWorker: true,
    });

    await bootstrap(opts);

    opts.rootHooks = rootHooks;

    const mocha = new MochaImpl(opts).addFile(filepath);

    try {
      await mocha.loadFilesAsync();
    } catch (err) {
      debug("run(): could not load file %s: %s", filepath, err);
      throw err;
    }

    return new Promise((resolve, reject) => {
      let debugInterval;
      /* istanbul ignore next */
      if (isDebugEnabled) {
        debugInterval = setInterval(() => {
          debug("run(): still running %s...", filepath);
        }, 5000).unref();
      }
      mocha.run((result) => {
        // Runner adds these; if we don't remove them, we'll get a leak.
        process.removeAllListeners("uncaughtException");
        process.removeAllListeners("unhandledRejection");

        try {
          const serialized = serializeImpl(result);
          debug(
            "run(): completed run with %d test failures; returning to main process",
            typeof result.failures === "number" ? result.failures : 0,
          );
          resolve(serialized);
        } catch (err) {
          // TODO: figure out exactly what the sad path looks like here.
          // rejection should only happen if an error is "unrecoverable"
          debug("run(): serialization failed; rejecting: %O", err);
          reject(err);
        } finally {
          clearInterval(debugInterval);
        }
      });
    });
  }

  return { run };
};

/**
 * Registers a new worker to the pool and runs it.
 * Param should only be used for testing.
 */
export const startWorker = ({
  // This param object has a prop named workerpool.
  // We assign that prop to our existing workerpool value by default.
  // To disambiguate, we alias the prop as workerpoolImpl.
  workerpool: workerpoolImpl = workerpool,
  ...workerOptions
} = {}) => {
  if (workerpoolImpl.isMainThread) {
    throw new Error(
      "This script is intended to be run as a worker (by the `workerpool` package).",
    );
  }

  const worker = createWorker({ ...workerOptions });
  workerpoolImpl.worker(worker);
  debug("started worker process");
  return worker;
};
