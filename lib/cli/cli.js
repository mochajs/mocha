'use strict';

/* eslint no-unused-vars: off */

/**
 * Module dependencies.
 */

var Command = require('commander').Command;
var path = require('path');
var fs = require('fs');
var exists = fs.existsSync || path.existsSync;
var Mocha = require('../../');
var utils = Mocha.utils;
var interfaceNames = Object.keys(Mocha.interfaces);
var join = path.join;
var resolve = path.resolve;
var parser = require('./parser');

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date;
var setTimeout = global.setTimeout;
var setInterval = global.setInterval;
var clearTimeout = global.clearTimeout;
var clearInterval = global.clearInterval;
var rootDir = join(__dirname, '..', '..');
var cwd = process.cwd();
var defaultUI = 'bdd';

/**
 * Images.
 */

var images = {
  fail: join(rootDir, 'images', 'error.png'),
  pass: join(rootDir, 'images', 'ok.png')
};

/**
 * configures a Commander Command to parse mocha arguments,
 * but no actions are added.
 *
 * <b>NOTE</b>: unless you want to introduce many issues around --opts and --colors, use makeCommand
 *
 * @return {Command}
 */
exports.makeCommand = function () {
  /**
   * @type {Command}
   */

  var program = new Command();

  program._makeCommand = true;

  /**
   * Globals.
   */

  var globals = [];

  /**
   * Requires.
   */

  var requires = [];

// options

  // commander bug https://github.com/tj/commander.js/issues/584
  // commander functions get overridden by properties
  var parse = program.parse;
  var opts = program.opts;

  // override the default parse command to handle mocha options correctly
    // --opts, --no-colour
  program.parse = function (argv) {
    // took liberty here and decided NOT to mutate argv.
    var args = argv.slice();

    parser.expandOpts(args);

    var ret = parse.call(program, args);

    // fix things like the weirdness between --colors and --no-colours
    fixConfig(program);

    // for simplification
    program.globals = globals;
    program.require = requires;

    // reset opts function to what it should be.
    program.opts = opts;

    return ret;
  };

  program
    .version(JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8')).version)
    .usage('[debug] [options] [files]')
    .option('-A, --async-only', 'force all tests to take a callback (async) or return a promise')
    .option('-c, --colors', 'force enabling of colors')
    .option('-C, --no-colors', 'force disabling of colors')
    .option('-G, --growl', 'enable growl notification support')
    .option('-O, --reporter-options <k=v,k2=v2,...>', 'reporter-specific options')
    .option('-R, --reporter <name>', 'specify the reporter to use', 'spec')
    .option('-S, --sort', 'sort test files')
    .option('-b, --bail', 'bail after first test failure')
    .option('-d, --debug', "enable node's debugger, synonym for node --debug")
    .option('-g, --grep <pattern>', 'only run tests matching <pattern>')
    .option('-f, --fgrep <string>', 'only run tests containing <string>')
    .option('-gc, --expose-gc', 'expose gc extension')
    .option('-i, --invert', 'inverts --grep and --fgrep matches')
    .option('-r, --require <name>', 'require the given module')
    .option('-s, --slow <ms>', '"slow" test threshold in milliseconds [75]')
    .option('-t, --timeout <ms>', 'set test-case timeout in milliseconds [2000]')
    .option('-u, --ui <name>', 'specify user-interface (' + interfaceNames.join('|') + ')', defaultUI)
    .option('--check-leaks', 'check for global variable leaks')
    .option('--full-trace', 'display the full stack trace')
    .option('--compilers <ext>:<module>,...', 'use the given module(s) to compile files', list, [])
    .option('--debug-brk', "enable node's debugger breaking on the first line")
    .option('--globals <names>', 'allow the given comma-delimited global [names]', list, [])
    .option('--es_staging', 'enable all staged features')
    .option('--harmony<_classes,_generators,...>', 'all node --harmony* flags are available')
    .option('--preserve-symlinks', 'Instructs the module loader to preserve symbolic links when resolving and caching modules')
    .option('--icu-data-dir', 'include ICU data')
    .option('--inline-diffs', 'display actual/expected differences inline within each string')
    .option('--no-deprecation', 'silence deprecation warnings')
    .option('--no-exit', 'require a clean shutdown of the event loop: mocha will not call process.exit')
    .option('--no-timeouts', 'disables timeouts, given implicitly with --debug')
    .option('--opts <path>', 'specify opts path', 'test/mocha.opts')
    .option('--perf-basic-prof', 'enable perf linux profiler (basic support)')
    .option('--prof', 'log statistical profiling information')
    .option('--log-timer-events', 'Time events including external callbacks')
    .option('--recursive', 'include sub directories')
    .option('--retries <times>', 'set numbers of time to retry a failed test case')
    .option('--throw-deprecation', 'throw an exception anytime a deprecated function is used')
    .option('--trace', 'trace function calls')
    .option('--trace-deprecation', 'show stack traces on deprecations')
    .option('--use_strict', 'enforce strict mode')
    .option('--watch-extensions <ext>,...', 'additional extensions to monitor with --watch', list, [])
    .option('--delay', 'wait for async suite definition');

// --globals

  program.on('globals', function (val) {
    globals = globals.concat(list(val));
  });

// -r, --require

  module.paths.push(cwd, join(cwd, 'node_modules'));

  program.on('require', function (mod) {
    var abs = exists(mod) || exists(mod + '.js');
    if (abs) {
      mod = resolve(mod);
    }
    requires.push(mod);
  });

  return program;
};

/**
 * adds CLI actions to Commander Command
 * @param {Command} program
 */
exports.addActions = function (program) {
  program._name = 'mocha';

  if (!program._makeCommand) {
    throw new Error('program must be made with cli.makeCommand or configuration wont be correct');
  }

  program
    .option('--interfaces', 'display available interfaces')
    .option('--reporters', 'display available reporters')
    .option('-w, --watch', 'watch files for changes');

  // init command

  program
    .command('init <path>')
    .description('initialize a client-side mocha setup at <path>')
    .action(function (path) {
      var mkdir = require('mkdirp');
      mkdir.sync(path);
      var css = fs.readFileSync(join(rootDir, 'mocha.css'));
      var js = fs.readFileSync(join(rootDir, 'mocha.js'));
      var tmpl = fs.readFileSync(join(rootDir, 'lib/template.html'));
      fs.writeFileSync(join(path, 'mocha.css'), css);
      fs.writeFileSync(join(path, 'mocha.js'), js);
      fs.writeFileSync(join(path, 'tests.js'), '');
      fs.writeFileSync(join(path, 'index.html'), tmpl);
      process.exit(0);
    });

  // --reporters

  program.on('reporters', function () {
    console.log();
    console.log('    dot - dot matrix');
    console.log('    doc - html documentation');
    console.log('    spec - hierarchical spec list');
    console.log('    json - single json object');
    console.log('    progress - progress bar');
    console.log('    list - spec-style listing');
    console.log('    tap - test-anything-protocol');
    console.log('    landing - unicode landing strip');
    console.log('    xunit - xunit reporter');
    console.log('    min - minimal reporter (great with --watch)');
    console.log('    json-stream - newline delimited json events');
    console.log('    markdown - markdown documentation (github flavour)');
    console.log('    nyan - nyan cat!');
    console.log();
    process.exit();
  });

  // --interfaces

  program.on('interfaces', function () {
    console.log('');
    interfaceNames.forEach(function (interfaceName) {
      console.log('    ' + interfaceName);
    });
    console.log('');
    process.exit();
  });
};

/**
 * sets options on mocha after parameter parsing
 *
 * <b>NOTE: </b> will not expand --opts,
 *     use makeCommand to make the program command (and then it's handled correctly)
 *
 * @param {Mocha} mocha instance to configure
 * @param {{}|Command} program Command or parsed options to set (from program.opts())
 */
exports.setMochaOptions = function (mocha, program) {
  var options;

  if (program instanceof Command) {
    if (!program._makeCommand) {
      throw new Error('program must be made with cli.makeCommand or configuration wont be correct');
    }

    if (typeof program.opts !== 'function') {
      throw new Error('program.opts() has been overridden with a property opts, use cli.makeCommand instead');
    }

    options = program.opts();
  } else {
    options = program || {};
  }

  // reporter options

  var reporterOptions = {};
  if (options.reporterOptions !== undefined) {
    options.reporterOptions.split(',').forEach(function (opt) {
      var L = opt.split('=');
      if (L.length > 2 || L.length === 0) {
        throw new Error("invalid reporter option '" + opt + "'");
      } else if (L.length === 2) {
        reporterOptions[L[0]] = L[1];
      } else {
        reporterOptions[L[0]] = true;
      }
    });
  }

  // reporter

  mocha.reporter(options.reporter, reporterOptions);

  // load reporter

  var Reporter = null;
  try {
    Reporter = require('../reporters/' + options.reporter);
  } catch (err) {
    try {
      Reporter = require(options.reporter);
    } catch (err2) {
      throw new Error('reporter "' + options.reporter + '" does not exist');
    }
  }

  // --no-colors, --colors, differences are handled by fixConfig

  mocha.useColors(!!options.colors);

  // --inline-diffs

  if (options.inlineDiffs) {
    mocha.useInlineDiffs(true);
  }

  // --slow <ms>

  if (options.slow) {
    mocha.suite.slow(options.slow);
  }

  // --no-timeouts

  if (!options.timeouts) {
    mocha.enableTimeouts(false);
  }

  // --timeout

  if (options.timeout) {
    mocha.suite.timeout(options.timeout);
  }

  // --bail

  mocha.suite.bail(!!options.bail);

  // --grep

  if (options.grep) {
    mocha.grep(options.grep);
  }

  // --fgrep

  if (options.fgrep) {
    mocha.fgrep(options.fgrep);
  }

  // --invert

  if (options.invert) {
    mocha.invert();
  }

  // --check-leaks

  if (options.checkLeaks) {
    mocha.checkLeaks();
  }

  // --stack-trace

  if (options.fullTrace) {
    mocha.fullTrace();
  }

  // --growl

  if (options.growl) {
    mocha.growl();
  }

  // --async-only

  if (options.asyncOnly) {
    mocha.asyncOnly();
  }

  // --delay

  if (options.delay) {
    mocha.delay();
  }

  // --globals

  if (options.globals) {
    mocha.globals(options.globals);
  }

  // --retries

  if (options.retries) {
    mocha.suite.retries(options.retries);
  }

  // custom compiler support

  if (!('watchExtensions' in options)) {
    options.watchExtensions = [];
  }

  options.compilers.forEach(function (c) {
    var idx = c.indexOf(':');
    var ext = c.slice(0, idx);
    var mod = c.slice(idx + 1);

    if (mod[0] === '.') {
      mod = join(cwd, mod);
    }
    require(mod);

    options.watchExtensions.push(ext);
  });

  // requires

  if (options.require) {
    options.require.forEach(function (mod) {
      require(mod);
    });
  }

  // interface

  mocha.ui(options.ui);
};

/**
 * runs/watch mocha.
 * call after parsing options in Command
 *
 * @param {Mocha} mocha instance to run
 * @param {*} options parsed options to set (from program.opts())
 * @param {string[]} files resolved files from resolveFiles
 */
exports.run = function (mocha, options, files) {
  Error.stackTraceLimit = Infinity; // TODO: config

  if (!files.length) {
    throw new Error('No test files found');
  }

  process.on('SIGINT', function () {
    runner.abort();

    // This is a hack:
    // Instead of `process.exit(130)`, set runner.failures to 130 (exit code for SIGINT)
    // The amount of failures will be emitted as error code later
    runner.failures = 130;
  });

  // --watch

  var runner;
  var loadAndRun;
  var purge;
  var rerun;

  if (options.watch) {
    console.log();
    hideCursor();
    process.on('SIGINT', function () {
      showCursor();
      console.log('\n');
      process.exit(130);
    });

    var watchFiles = utils.files(cwd, ['js'].concat(options.watchExtensions || []));
    var runAgain = false;

    loadAndRun = function loadAndRun () {
      try {
        mocha.files = files;
        runAgain = false;
        runner = mocha.run(function () {
          runner = null;
          if (runAgain) {
            rerun();
          }
        });
      } catch (e) {
        console.log(e.stack);
      }
    };

    purge = function purge () {
      watchFiles.forEach(function (file) {
        delete require.cache[file];
      });
    };

    loadAndRun();

    rerun = function rerun () {
      purge();
      stop();
      if (!options.grep) {
        mocha.grep(null);
      }
      mocha.suite = mocha.suite.clone();
      mocha.suite.ctx = new Mocha.Context();
      mocha.ui(options.ui || defaultUI);
      loadAndRun();
    };

    utils.watch(watchFiles, function () {
      runAgain = true;
      if (runner) {
        runner.abort();
      } else {
        rerun();
      }
    });
  } else {
    // load

    mocha.files = files;
    runner = mocha.run(options.exit ? exit : exitLater);
  }
};

/**
 * loads files
 * @param {string[]} files files to load
 * @param {*} options object containing parsed and set options from CLI
 * @return {string[]} resolved files
 */
exports.resolveFiles = function (files, options) {
  files = (files.length) ? files : ['test'];

  var _files = [];
  var extensions = ['js'];

  if (options.watchExtensions) {
    extensions = extensions.concat(options.watchExtensions);
  }

  // default files to test/*.{js,coffee}

  files.forEach(function (file) {
    var newFiles;
    try {
      newFiles = utils.lookupFiles(file, extensions, options.recursive || false);
    } catch (err) {
      if (err.message.indexOf('cannot resolve path') === 0) {
        console.error('Warning: Could not find any test files matching pattern: ' + file);
        return;
      }

      throw err;
    }

    _files = _files.concat(newFiles);
  });

  // resolve

  _files = _files.map(function (path) {
    return resolve(path);
  });

  if (options.sort) {
    _files.sort();
  }

  return _files;
};

function exitLater (code) {
  process.on('exit', function () {
    process.exit(Math.min(code, 255));
  });
}

function exit (code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done () {
    if (!(draining--)) {
      process.exit(Math.min(code, 255));
    }
  }

  var draining = 0;
  var streams = [process.stdout, process.stderr];

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1;
    stream.write('', done);
  });

  done();
}

/**
 * Parse list.
 */

function list (str) {
  return str.split(/ *, */);
}

/**
 * Hide the cursor.
 */

function hideCursor () {
  process.stdout.write('\u001b[?25l');
}

/**
 * Show the cursor.
 */

function showCursor () {
  process.stdout.write('\u001b[?25h');
}

/**
 * Stop play()ing.
 */

function stop () {
  process.stdout.write('\u001b[2K');
  clearInterval(play.timer);
}

/**
 * Play the given array of strings.
 */

function play (arr, interval) {
  var len = arr.length;
  interval = interval || 100;
  var i = 0;

  play.timer = setInterval(function () {
    var str = arr[i++ % len];
    process.stdout.write('\u001b[0G' + str);
  }, interval);
}

/**
 * Fixes some oddities that are introduced due to the structure of the cli options.
 * @param {Command} program
 */
function fixConfig (program) {
  // --no-colors
  if (!program.colors) {
    program.colors = false;
  }

  // --colors
  if (~program.rawArgs.indexOf('--colors') || ~program.rawArgs.indexOf('-c')) {
    program.colors = true;
  }
}
