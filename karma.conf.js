'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var baseBundleDirpath = path.join(__dirname, '.karma');
var osName = require('os-name');
var browserMatrix = require('./.browser-matrix.json');

/**
 * Relevant environment variables:
 *
 * - CI: If present, will attempt to run tests on SauceLabs.  If neither TRAVIS
 * nor APPVEYOR are present, then we configure for local execution.
 * - TRAVIS: If present, configure for Travis-CI
 * - APPVEYOR: If present, abort; Travis-CI runs browser tests
 * - SAUCE_ACCESS_KEY, SAUCE_USERNAME: Must be present to run tests on
 * SauceLabs.  Specify these with CI=1 to run against SauceLabs locally.
 * - MOCHA_BROWSER: The browser (singular) to run against.  Can be one of
 * "Chrome", "PhantomJS" (launchers installed by default) any key present in
 * `.browser-matrix.json`, or any custom Karma launcher you've installed
 * locally.  Note that PhantomJS 1.9.x is incompatible with macOS Sierra, and
 * we default to Safari in that case.
 * - MOCHA_UI: If present, will run integration tests for the particular interface.  One of "tdd", "bdd", or "qunit".  These tests are mutually exclusive with any others.
 * - S3: If present, upload build artifacts to S3.  This requires AWS credentials; see scripts/travis-after-script.sh for details.  The folder in S3 will correspond to the Travis build number, or simply "local" if not running on Travis.
 *
 * Example of running tests against sauce locally:
 * $ CI=1 SAUCE_ACCESS_KEY=<key> SAUCE_USERNAME=mochajs make test-browser
 *
 * Example of running Karma against multiple browsers (whose launchers must be installed) a single time:
 * $ karma start --browsers Chrome,PhantomJS --single-run
 *
 * Example of running Karma on SauceLabs against IE8 in "watch" mode:
 * $ CI=1 SAUCE_ACCESS_KEY=<key> SAUCE_USERNAME=mochajs MOCHA_BROWSER=ie8 karma start
 */

module.exports = function (config) {
  var env = process.env;
  var cfg = {
    artifactDirpath: path.join(baseBundleDirpath, 'local'),
    frameworks: [
      'browserify',
      'expect',
      'mocha'
    ],
    files: [
      // we use the BDD interface for all of the tests that
      // aren't interface-specific.
      'test/browser-fixtures/bdd.fixture.js',
      'test/acceptance/*.spec.js'
    ],
    exclude: [
      'test/acceptance/http.spec.js',
      'test/acceptance/fs.spec.js',
      'test/acceptance/file-utils.spec.js',
      'test/acceptance/require/**/*.js',
      'test/acceptance/misc/**/*.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      configure: function configure (b) {
        b.ignore('glob')
          .ignore('fs')
          .ignore('path')
          .ignore('supports-color')
          .on('bundled', function (err, content) {
            if (!err) {
              // write bundle to directory for debugging
              fs.writeFileSync(path.join(cfg.artifactDirpath,
                'bundle.' + Date.now() + '.js'), content);
            }
          });
      }
    },
    reporters: ['spec'],
    colors: true,
    browsers: defaultBrowsers(),
    logLevel: config.LOG_INFO, // use HTML reporter for better debugging
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  };

  if (env.CI) {
    console.error('CI mode enabled');
    configureCI(cfg);
  } else {
    console.error('CI mode disabled');
    if (env.MOCHA_BROWSER) {
      cfg.browsers = [env.MOCHA_BROWSER];
    } else {
      cfg.browsers = defaultBrowsers();
    }
  }

  // create dir for build artifacts
  mkdirp.sync(cfg.artifactDirpath);

  // if MOCHA_UI is present, this will choose the appropriate tests.
  configureInterface(cfg);

  config.set(cfg);
};

function addSauceTests (cfg, browser) {
  var browserName = String(browser)
    .toLowerCase();
  var browserConfig = browserMatrix[browserName];
  if (browserConfig) {
    cfg.customLaunchers = {};
    cfg.customLaunchers[browserName] = browserConfig;
    cfg.reporters.push('saucelabs');
    cfg.browsers = Object.keys(cfg.customLaunchers);
    Object.assign(cfg.sauceLabs, {
      public: 'public',
      startConnect: true
    });
    // for slow browser booting, ostensibly
    cfg.captureTimeout = 120000;
    cfg.browserNoActivityTimeout = 20000;
  } else {
    console.error('Unknown browser "' + browser + '"; using defaults');
  }
}

function configureSauce (cfg, sauceLabs) {
  var env = process.env;
  if (isPhantom()) {
    console.error('Skipping SauceLabs config for PhantomJS');
  } else {
    if (env.SAUCE_USERNAME && env.SAUCE_ACCESS_KEY) {
      cfg.sauceLabs = sauceLabs;
      addSauceTests(cfg, env.MOCHA_BROWSER);
      console.error('Configured SauceLabs');
    } else {
      console.error('No SauceLabs credentials present; using defaults');
    }
  }
}

function defaultBrowsers () {
  return [osName() === 'macOS Sierra' ? 'Safari' : 'PhantomJS'];
}

function isPhantom () {
  return /phantomjs/i.test(process.env.MOCHA_BROWSER);
}

function configureCI (cfg) {
  var env = process.env;

  // we don't run browser tests in AppVeyor; Travis does it instead
  if (env.APPVEYOR) {
    console.error('AppVeyor detected; nothing to do');
    process.exit();
  } else if (env.TRAVIS) {
    console.error('Travis-CI detected');
    cfg.artifactDirpath = path.join(baseBundleDirpath, env.TRAVIS_BUILD_ID);
    configureSauce(cfg, {
      build: 'TRAVIS #' + env.TRAVIS_BUILD_NUMBER + ' (' + env.TRAVIS_BUILD_ID +
      ')',
      tunnelIdentifier: env.TRAVIS_JOB_NUMBER
    });
  } else {
    console.error('Local/unknown CI environment detected');
    configureSauce(cfg, {
      build: require('os')
        .hostname() + ' (' + Date.now() + ')'
    });
  }
}

function configureInterface (cfg) {
  // the MOCHA_UI env var will determine if we're running interface-specific
  // tets.  since you can only load one at a time, each must be run separately.
  // each has its own set of acceptance tests and a fixture.
  // the "bdd" fixture is used by default.
  var ui = process.env.MOCHA_UI;
  if (ui) {
    if (cfg.sauceLabs) {
      cfg.sauceLabs.testName = 'Interface "' + ui + '" integration tests';
    }
    cfg.files = [
      'test/browser-fixtures/' + ui + '.fixture.js',
      'test/acceptance/interfaces/' + ui + '.spec.js'
    ];
  } else if (cfg.sauceLabs) {
    cfg.sauceLabs.testName = 'Tests';
  }
}
