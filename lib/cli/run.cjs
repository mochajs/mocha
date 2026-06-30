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
  createInvalidArgumentValueError,
  createMissingArgumentError,
} = require("../errors.js");

const {
  list,
  handleRequires,
  validateLegacyPlugin,
  runMocha,
} = require("./run-helpers.cjs");
const { ONE_AND_DONES } = require("./one-and-dones.js");
const debug = require("debug")("mocha:cli:run");

exports.command = ["$0 [spec..]", "inspect"];

exports.describe = "Run tests with Mocha";

const camelCase = (name) =>
  name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const coerceReporterOption = (opts) =>
  list(opts).reduce((acc, opt) => {
    const pair = opt.split("=");

    if (pair.length > 2 || !pair.length) {
      throw createInvalidArgumentValueError(
        `invalid reporter option '${opt}'`,
        "--reporter-option",
        opt,
        'expected "key=value" format',
      );
    }

    acc[pair[0]] = pair.length === 2 ? pair[1] : true;
    return acc;
  }, {});

const normalizeRunOptions = (argv) => {
  Object.keys(argv).forEach((name) => {
    if (name.includes("-")) {
      const normalizedName = camelCase(name);
      if (!(normalizedName in argv)) {
        argv[normalizedName] = argv[name];
      }
    }
  });

  if (Array.isArray(argv["reporter-option"])) {
    argv["reporter-option"] = coerceReporterOption(argv["reporter-option"]);
  }

  return argv;
};

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

  if (argv.fgrep && argv.grep) {
    throw createUnsupportedError(
      "Arguments fgrep and grep are mutually exclusive",
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
exports.normalizeRunOptions = normalizeRunOptions;

exports.handler = async function (argv) {
  normalizeRunOptions(argv);
  debug("running with config", argv);
  const mocha = new Mocha(argv);

  try {
    await runMocha(mocha, argv);
  } catch (err) {
    console.error("\n Exception during run:", err);
    process.exit(1);
  }
};
