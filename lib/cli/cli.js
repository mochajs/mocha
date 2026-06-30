/**
 * Contains CLI entry point and public API for programmatic usage in Node.js.
 * - Option parsing is handled by {@link module:lib/cli/parse-args}.
 * - If executed via `node`, this module will run {@linkcode module:lib/cli.main main()}.
 * @public
 * @module lib/cli
 */

import debugModule from "debug";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { loadOptions } from "./options.cjs";
import { run, init } from "./commands.js";
import pc from "picocolors";
import { logSymbols } from "../utils.cjs";

import packageJson from "../../package.json" with { type: "json" };

const require = createRequire(import.meta.url);
const { getRunOptionDefinitions } = require("./run-option-metadata.cjs");

const __filename = fileURLToPath(import.meta.url);

const debug = debugModule("mocha:cli:cli");

const hasFlag = (args, longName, shortName) =>
  args.includes(`--${longName}`) || args.includes(`-${shortName}`);

const formatOption = (option) => {
  const aliases = option.aliases.map((alias) =>
    alias.length === 1 ? `-${alias}` : `--${alias}`,
  );
  return [`--${option.name}`].concat(aliases).join(", ");
};

const printVersion = () => {
  console.log(packageJson.version);
};

const printHelp = () => {
  const options = getRunOptionDefinitions()
    .filter((option) => option.description)
    .map((option) => `  ${formatOption(option).padEnd(34)} ${option.description}`)
    .join("\n");

  console.log(`Usage: mocha [spec..]
       mocha init <path>

Commands:
  init <path>  ${init.description}

Options:
${options}
  --help, -h${"".padEnd(24)} Show usage information & exit
  --version, -V${"".padEnd(21)} Show version number & exit

Mocha Resources
    Chat: ${packageJson.discord}
  GitHub: ${packageJson.repository.url}
    Docs: ${packageJson.homepage}`);
};

const fail = (msg, err) => {
  debug("caught error before command handler: %O", err);
  printHelp();
  console.error(`\n${logSymbols.error} ${pc.red("ERROR:")} ${msg}`);
  if (!msg && err) {
    // Log raw error and stack when an unexpected error is encountered, to
    // make debugging easier (instead of an inactionable "ERROR: null").
    console.error(err);
  }
  process.exit(1);
};

const failRunPreparation = (err) => {
  console.error(`\n${logSymbols.error} ${pc.red("ERROR:")}`, err);
  process.exit(1);
};

const runCommand = async (args) => {
  args.spec = args.spec || (args._ && args._.length ? args._ : ["test"]);

  try {
    run.validateRunOptions(args);
  } catch (err) {
    fail(err && err.message, err);
  }

  try {
    await run.prepareRunOptions(args);
  } catch (err) {
    failRunPreparation(err);
  }

  return run.handler(args);
};

/**
 * - Accepts an `Array` of arguments
 * - Modifies {@link https://nodejs.org/api/modules.html#modules_module_paths Node.js' search path} for easy loading of consumer modules
 * - Sets {@linkcode https://nodejs.org/api/errors.html#errors_error_stacktracelimit Error.stackTraceLimit} to `Infinity`
 * @public
 * @summary Mocha's main command-line entry-point.
 * @param {string[]} argv - Array of arguments to parse, or by default the lovely `process.argv.slice(2)`
 * @param {object} [mochaArgs] - Object of already parsed Mocha arguments (by bin/mocha)
 */
export function main(argv = process.argv.slice(2), mochaArgs) {
  debug("entered main with raw args", argv);

  try {
    Error.stackTraceLimit = Infinity; // configurable via --stack-trace-limit?
  } catch (err) {
    debug("unable to set Error.stackTraceLimit = Infinity", err);
  }

  try {
    const args = mochaArgs ?? loadOptions(argv);
    if (hasFlag(argv, "help", "h") || args.help || args.h) {
      printHelp();
      process.exit(0);
    }

    if (hasFlag(argv, "version", "V") || args.version || args.V) {
      printVersion();
      process.exit(0);
    }

    const command = argv[0] || (args._ && args._[0]);
    if (command === "init") {
      const commandArgs = argv[0] === "init" ? argv.slice(1) : args._.slice(1);
      return init.handler(init.parse(commandArgs));
    }

    return runCommand(args);
  } catch (err) {
    fail(err && err.message, err);
  }
}

// allow direct execution
if (__filename === process.argv[1]) {
  main();
}
