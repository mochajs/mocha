'use strict';

/**
 * This is where we finally parse and handle arguments passed to the `mocha` executable.
 * Option parsing is handled by {@link https://npm.im/yargs yargs}.
 * If executed via `node`, this module will run {@linkcode module:lib/cli/cli.main main()}.
 *
 * @private
 * @module
 */

const debug = require('debug')('mocha:cli:cli');
const symbols = require('log-symbols');
const path = require('path');
const ansi = require('ansi-colors');
const {repository, homepage, version, gitter} = require('../../package.json');

/**
 * - Accepts an `Array` of arguments
 * - Modifies {@link https://nodejs.org/api/modules.html#modules_module_paths Node.js' search path} for easy loading of consumer modules
 * - Sets {@linkcode https://nodejs.org/api/errors.html#errors_error_stacktracelimit Error.stackTraceLimit} to `Infinity`
 * @summary Mocha's main entry point from the command-line.
 * @param {string[]} argv - Array of arguments to parse, or by default the lovely `process.argv.slice(2)`
 */
exports.main = (argv = process.argv.slice(2)) => {
  debug('entered main with raw args', argv);
  // ensure we can require() from current working directory
  module.paths.push(process.cwd(), path.resolve('node_modules'));

  Error.stackTraceLimit = Infinity; // configurable via --stack-trace-limit?

  const args = exports.parseArgv(argv);
  const {handler} = require(`./${args.command.name}`);
  args.command = null;
  handler(args);
};

exports.yargsParse = function(argv) {
  const {loadOptions} = require('./options');
  return exports
    .createYargs()
    .parse(argv, Object.assign(loadOptions(argv), {command: {}}));
};

exports.showUsageAndError = function(error) {
  exports
    .createYargs()
    .check(() => {
      throw error;
    })
    .parse([]);
};

exports.createYargs = function() {
  const yargs = require('yargs');
  const {YARGS_PARSER_CONFIG} = require('./options');
  const commands = require('./commands');
  return yargs
    .scriptName('mocha')
    .command(commands.run)
    .command(commands.init)
    .updateStrings({
      'Positionals:': 'Positional Arguments',
      'Options:': 'Other Options',
      'Commands:': 'Commands'
    })
    .fail((msg, err, yargs) => {
      debug(err);
      yargs.showHelp();
      console.error(`\n${symbols.error} ${ansi.red('ERROR:')} ${msg}`);
      process.exit(1);
    })
    .help('help', 'Show usage information & exit')
    .alias('help', 'h')
    .version('version', 'Show version number & exit', version)
    .alias('version', 'V')
    .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 80) : 80)
    .epilog(
      `Mocha Resources
    Chat: ${ansi.magenta(gitter)}
  GitHub: ${ansi.blue(repository.url)}
    Docs: ${ansi.yellow(homepage)}
      `
    )
    .parserConfiguration(YARGS_PARSER_CONFIG);
};

exports.parseArgv = function(argv = process.argv.slice(2)) {
  if (argv.length === 2 && argv[0] === '--preParsedJsonOptions') {
    return JSON.parse(argv[1]);
  }
  return exports.yargsParse(argv);
};

// allow direct execution
if (require.main === module) {
  exports.main();
}
