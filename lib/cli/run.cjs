"use strict";

/**
 * Definition for Mocha's default ("run tests") command
 *
 * @module
 * @private
 */

const Mocha = require("../mocha.cjs");
const {
  createUnsupportedError,
  createMissingArgumentError,
} = require("../errors.js");

const {
  handleRequires,
  validateLegacyPlugin,
  runMocha,
} = require("./run-helpers.cjs");
const { ONE_AND_DONES } = require("./one-and-dones.js");
const debug = require("debug")("mocha:cli:run");

exports.command = ["$0 [spec..]", "inspect"];

exports.describe = "Run tests with Mocha";

const validateRunOptions = (argv) => {
  // "one-and-dones"; help and version are handled by the top-level CLI.
  Object.keys(ONE_AND_DONES).forEach((opt) => {
    if (argv[opt]) {
      ONE_AND_DONES[opt].call(null);
      process.exit(0);
    }
  });

  if (argv.invert && !("fgrep" in argv || "grep" in argv)) {
    throw createMissingArgumentError(
      '"--invert" requires one of "--fgrep <str>" or "--grep <regexp>"',
      "--fgrep|--grep",
      "string|regexp",
    );
  }

  if (argv.parallel) {
    if (argv.file) {
      throw createUnsupportedError(
        "--parallel runs test files in a non-deterministic order, and is mutually exclusive with --file",
      );
    }

    if (argv.sort) {
      throw createUnsupportedError(
        "--parallel runs test files in a non-deterministic order, and is mutually exclusive with --sort",
      );
    }

    if (["progress", "markdown", "json-stream"].includes(argv.reporter)) {
      throw createUnsupportedError(
        `--reporter=${argv.reporter} is mutually exclusive with --parallel`,
      );
    }
  }
};

const prepareRunOptions = async (argv) => {
  const plugins = await handleRequires(argv.require);
  validateLegacyPlugin(argv, "reporter", Mocha.reporters);
  validateLegacyPlugin(argv, "ui", Mocha.interfaces);
  Object.assign(argv, plugins);
  return argv;
};

exports.validateRunOptions = validateRunOptions;
exports.prepareRunOptions = prepareRunOptions;

exports.handler = async function (argv) {
  debug("running with config", argv);
  const mocha = new Mocha(argv);

  try {
    await runMocha(mocha, argv);
  } catch (err) {
    console.error("\n Exception during run:", err);
    process.exit(1);
  }
};
