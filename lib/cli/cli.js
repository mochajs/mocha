/**
 * Contains CLI entry point and public API for programmatic usage in Node.js.
 * - Option parsing is handled by {@link https://npm.im/yargs yargs}.
 * - If executed via `node`, this module will run {@linkcode module:lib/cli.main main()}.
 * @public
 * @module lib/cli
 */

import dbg from "debug";
import yargs from "yargs";
import path from "node:path";
import {
  loadRc,
  loadPkgRc,
  loadOptions,
  YARGS_PARSER_CONFIG,
} from "./options.js";
import * as lookupFiles from "./lookup-files.js";
import * as commands from "./commands.js";
import pc from "picocolors";
import packageJson from "../../package.json" with { type: "json" };
import { cwd, logSymbols } from "../utils.js";

const { repository, homepage, version, discord } = packageJson;

const debug = dbg("mocha:cli:cli");

/**
 * - Accepts an `Array` of arguments
 * - Modifies {@link https://nodejs.org/api/modules.html#modules_module_paths Node.js' search path} for easy loading of consumer modules
 * - Sets {@linkcode https://nodejs.org/api/errors.html#errors_error_stacktracelimit Error.stackTraceLimit} to `Infinity`
 * @public
 * @summary Mocha's main command-line entry-point.
 * @param {string[]} argv - Array of arguments to parse, or by default the lovely `process.argv.slice(2)`
 * @param {object} [mochaArgs] - Object of already parsed Mocha arguments (by bin/mocha)
 */
export const main = (argv = process.argv.slice(2), mochaArgs) => {
  debug("entered main with raw args", argv);
  // ensure we can require() from current working directory
  if (typeof module !== "undefined" && typeof module.paths !== "undefined") {
    module.paths.push(cwd(), path.resolve("node_modules"));
  }

  try {
    Error.stackTraceLimit = Infinity; // configurable via --stack-trace-limit?
  } catch (err) {
    debug("unable to set Error.stackTraceLimit = Infinity", err);
  }

  var args = mochaArgs || loadOptions(argv);

  yargs()
    .scriptName("mocha")
    .command(commands.run)
    .command(commands.init)
    .updateStrings({
      "Positionals:": "Positional Arguments",
      "Options:": "Other Options",
      "Commands:": "Commands",
    })
    .fail((msg, err, yargs) => {
      debug("caught error sometime before command handler: %O", err);
      yargs.showHelp();
      console.error(`\n${logSymbols.error} ${pc.red("ERROR:")} ${msg}`);
      if (!msg) {
        // Log raw error and stack when an unexpected error is encountered, to
        // make debugging easier (instead of an inactionable "ERROR: null").
        console.error(err);
      }
      process.exit(1);
    })
    .help("help", "Show usage information & exit")
    .alias("help", "h")
    .version("version", "Show version number & exit", version)
    .alias("version", "V")
    .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 80) : 80)
    .epilog(
      `${pc.reset("Mocha Resources")}
    Chat: ${pc.magenta(discord)}
  GitHub: ${pc.blue(repository.url)}
    Docs: ${pc.yellow(homepage)}
      `,
    )
    .parserConfiguration(YARGS_PARSER_CONFIG)
    .config(args)
    .parse(args._);
};

export { lookupFiles, loadOptions, loadPkgRc, loadRc };

// allow direct execution
if (import.meta.main) {
  main();
}
