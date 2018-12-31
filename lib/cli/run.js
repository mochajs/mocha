'use strict';

/**
 * Definition for Mocha's default ("run tests") command
 *
 * @module
 * @private
 */

const Mocha = require('../mocha');
const ansi = require('ansi-colors');
const errors = require('../errors');
const createInvalidArgumentValueError = errors.createInvalidArgumentValueError;

const {
  list,
  handleFiles,
  handleRequires,
  validatePlugin,
  runMocha
} = require('./run-helpers');
const {ONE_AND_DONES, ONE_AND_DONE_ARGS} = require('./one-and-dones');
const debug = require('debug')('mocha:cli:run');
const defaults = require('../mocharc');
const {types, aliases} = require('./run-option-metadata');

/**
 * Logical option groups
 * @constant
 */
const GROUPS = {
  FILES: 'File Handling',
  FILTERS: 'Test Filters',
  NODEJS: 'Node.js & V8',
  OUTPUT: 'Reporting & Output',
  RULES: 'Rules & Behavior',
  CONFIG: 'Configuration'
};

exports.command = ['$0 [spec..]', 'debug [spec..]'];

exports.describe = 'Run tests with Mocha';

exports.builder = yargs =>
  yargs
    .options({
      'allow-uncaught': {
        description: 'Allow uncaught errors to propagate',
        group: GROUPS.RULES
      },
      'async-only': {
        description:
          'Require all tests to use a callback (async) or return a Promise',
        group: GROUPS.RULES
      },
      bail: {
        description: 'Abort ("bail") after first test failure',
        group: GROUPS.RULES
      },
      'check-leaks': {
        description: 'Check for global variable leaks',
        group: GROUPS.RULES
      },
      color: {
        description: 'Force-enable color output',
        group: GROUPS.OUTPUT
      },
      config: {
        config: true,
        defaultDescription: '(nearest rc file)',
        description: 'Path to config file',
        group: GROUPS.CONFIG
      },
      delay: {
        description: 'Delay initial execution of root suite',
        group: GROUPS.RULES
      },
      diff: {
        default: true,
        description: 'Show diff on failure',
        group: GROUPS.OUTPUT
      },
      exclude: {
        defaultDescription: '(none)',
        description: 'Ignore file(s) or glob pattern(s)',
        group: GROUPS.FILES,
        requiresArg: true
      },
      exit: {
        description: 'Force Mocha to quit after tests complete',
        group: GROUPS.RULES
      },
      extension: {
        default: defaults.extension,
        defaultDescription: 'js',
        description: 'File extension(s) to load and/or watch',
        group: GROUPS.FILES,
        requiresArg: true,
        coerce: list
      },
      fgrep: {
        conflicts: 'grep',
        description: 'Only run tests containing this string',
        group: GROUPS.FILTERS,
        requiresArg: true
      },
      file: {
        defaultDescription: '(none)',
        description:
          'Specify file(s) to be loaded prior to root suite execution',
        group: GROUPS.FILES,
        normalize: true,
        requiresArg: true
      },
      'forbid-only': {
        description: 'Fail if exclusive test(s) encountered',
        group: GROUPS.RULES
      },
      'forbid-pending': {
        description: 'Fail if pending test(s) encountered',
        group: GROUPS.RULES
      },
      'full-trace': {
        description: 'Display full stack traces',
        group: GROUPS.OUTPUT
      },
      global: {
        coerce: list,
        description: 'List of allowed global variables',
        group: GROUPS.RULES,
        requiresArg: true
      },
      grep: {
        coerce: value => (!value ? null : value),
        conflicts: 'fgrep',
        description: 'Only run tests matching this string or regexp',
        group: GROUPS.FILTERS,
        requiresArg: true
      },
      growl: {
        description: 'Enable Growl notifications',
        group: GROUPS.OUTPUT
      },
      'inline-diffs': {
        description:
          'Display actual/expected differences inline within each string',
        group: GROUPS.OUTPUT
      },
      interfaces: {
        conflicts: Array.from(ONE_AND_DONE_ARGS),
        description: 'List built-in user interfaces & exit'
      },
      invert: {
        description: 'Inverts --grep and --fgrep matches',
        group: GROUPS.FILTERS
      },
      'no-colors': {
        description: 'Force-disable color output',
        group: GROUPS.OUTPUT,
        hidden: true
      },
      opts: {
        default: defaults.opts,
        description: 'Path to `mocha.opts`',
        group: GROUPS.CONFIG,
        normalize: true,
        requiresArg: true
      },
      package: {
        description: 'Path to package.json for config',
        group: GROUPS.CONFIG,
        normalize: true,
        requiresArg: true
      },
      recursive: {
        description: 'Look for tests in subdirectories',
        group: GROUPS.FILES
      },
      reporter: {
        default: defaults.reporter,
        description: 'Specify reporter to use',
        group: GROUPS.OUTPUT,
        requiresArg: true
      },
      reporters: {
        conflicts: Array.from(ONE_AND_DONE_ARGS),
        description: 'List built-in reporters & exit'
      },
      'reporter-option': {
        coerce: opts =>
          opts.reduce((acc, opt) => {
            const pair = opt.split('=');

            if (pair.length > 2 || !pair.length) {
              throw createInvalidArgumentValueError(
                `invalid reporter option '${opt}'`,
                '--reporter-option',
                opt,
                'expected "key=value" format'
              );
            }

            acc[pair[0]] = pair.length === 2 ? pair[1] : true;
            return acc;
          }, {}),
        description: 'Reporter-specific options (<k=v,[k1=v1,..]>)',
        group: GROUPS.OUTPUT,
        requiresArg: true
      },
      require: {
        defaultDescription: '(none)',
        description: 'Require module',
        group: GROUPS.FILES,
        requiresArg: true
      },
      retries: {
        description: 'Retry failed tests this many times',
        group: GROUPS.RULES
      },
      slow: {
        default: defaults.slow,
        description: 'Specify "slow" test threshold (in milliseconds)',
        group: GROUPS.RULES
      },
      sort: {
        description: 'Sort test files',
        group: GROUPS.FILES
      },
      timeout: {
        default: defaults.timeout,
        description: 'Specify test timeout threshold (in milliseconds)',
        group: GROUPS.RULES
      },
      ui: {
        default: defaults.ui,
        description: 'Specify user interface',
        group: GROUPS.RULES,
        requiresArg: true
      },
      watch: {
        description: 'Watch files in the current working directory for changes',
        group: GROUPS.FILES
      }
    })
    .positional('spec', {
      default: ['test/'],
      description: 'One or more files, directories, or globs to test',
      type: 'array'
    })
    .check(argv => {
      // "one-and-dones"; let yargs handle help and version
      Object.keys(ONE_AND_DONES).forEach(opt => {
        if (argv[opt]) {
          ONE_AND_DONES[opt].call(null, yargs);
          process.exit();
        }
      });

      // yargs.implies() isn't flexible enough to handle this
      if (argv.invert && !('fgrep' in argv || 'grep' in argv)) {
        throw new Error(
          '"--invert" requires one of "--fgrep <str>" or "--grep <regexp>"'
        );
      }

      if (argv.compilers) {
        throw new Error(
          `--compilers is DEPRECATED and no longer supported.
          See ${ansi.cyan('https://git.io/vdcSr')} for migration information.`
        );
      }

      // load requires first, because it can impact "plugin" validation
      handleRequires(argv.require);
      validatePlugin(argv, 'reporter', Mocha.reporters);
      validatePlugin(argv, 'ui', Mocha.interfaces);

      return true;
    })
    .array(types.array)
    .boolean(types.boolean)
    .string(types.string)
    .number(types.number)
    .alias(aliases);

exports.handler = argv => {
  debug('post-yargs config', argv);
  const mocha = new Mocha(argv);
  const files = handleFiles(argv);

  debug('running tests with files', files);
  runMocha(mocha, argv, files);
};
