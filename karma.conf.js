'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var baseBundleDirpath = path.join(__dirname, '.karma');
var builder = require('./scripts/build');
var build = builder.build;
var bundlerOptions = builder.options;

var browserPlatformPairs = {
  'chrome@latest': 'Windows 8',
  'MicrosoftEdge@latest': 'Windows 10',
  'internet explorer@11.0': 'Windows 8.1',
  'internet explorer@10.0': 'Windows 8',
  'internet explorer@9.0': 'Windows 7',
  'firefox@latest': 'Windows 10',
  'safari@latest': 'OS X 10.12'
};

module.exports = function (config) {
  var bundleDirpath;
  var cfg = {
    frameworks: [
      'browserify',
      'expect',
      'mocha'
    ],
    files: [
      // we use the BDD interface for all of the tests that
      // aren't interface-specific.
      'test/browser-fixtures/bdd.fixture.js',
      'test/unit/*.spec.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: Object.assign({
      insertGlobalVars: bundlerOptions.insertGlobalVars
    }, {
      debug: true,
      configure: function configure (b) {
        build(b)
          .on('bundled', function (err, content) {
            if (err) {
              throw err;
            }
            if (bundleDirpath) {
              // write bundle to directory for debugging
              fs.writeFileSync(path.join(bundleDirpath, 'mocha.' + Date.now() +
                '.js'), content);
            }
          });
      }
    }),
    reporters: ['mocha'],
    colors: true,
    browsers: ['PhantomJS'],
    logLevel: config.LOG_INFO,
    client: {
      mocha: {
        reporter: 'html'
      }
    },
    mochaReporter: {
      showDiff: true
    }
  };

  // TO RUN AGAINST SAUCELABS LOCALLY, execute:
  // `CI=1 SAUCE_USERNAME=<user> SAUCE_ACCESS_KEY=<key> make test-browser`
  var env = process.env;
  var sauceConfig;

  if (env.CI) {
    console.error('CI mode enabled');
    if (env.TRAVIS) {
      console.error('Travis-CI detected');
      bundleDirpath = path.join(baseBundleDirpath, process.env.TRAVIS_BUILD_ID);
      if (env.SAUCE_USERNAME && env.SAUCE_ACCESS_KEY) {
        // correlate build/tunnel with Travis
        sauceConfig = {
          build: 'TRAVIS #' + env.TRAVIS_BUILD_NUMBER + ' (' +
          env.TRAVIS_BUILD_ID + ')',
          tunnelIdentifier: env.TRAVIS_JOB_NUMBER,
          startConnect: false
        };
        console.error('Configured SauceLabs');
      } else {
        console.error('No SauceLabs credentials present');
      }
    } else if (env.APPVEYOR) {
      throw new Error('no browser tests should run on AppVeyor!');
    } else {
      console.error('Local/unknown environment detected');
      bundleDirpath = path.join(baseBundleDirpath, 'local');
      // don't need to run sauce from appveyor b/c travis does it.
      if (env.SAUCE_USERNAME || env.SAUCE_ACCESS_KEY) {
        var id = require('os').hostname() + ' (' + Date.now() + ')';
        sauceConfig = {
          build: id,
          tunnelIdentifier: id,
          startConnect: true
        };
        console.error('Configured SauceLabs');
      } else {
        console.error('No SauceLabs credentials present');
      }
    }
    mkdirp.sync(bundleDirpath);
  } else {
    console.error('CI mode disabled');
  }

  if (sauceConfig) {
    cfg.sauceLabs = sauceConfig;
    addSauceTests(cfg);
  }

  /* the MOCHA_TEST env var will be set for "special" cases of tests.
   * these may require different interfaces or other setup which make
   * them unable to be batched w/ the rest.
   */
  var MOCHA_TEST = env.MOCHA_TEST;
  switch (MOCHA_TEST) {
    case 'bdd':
    case 'tdd':
    case 'qunit':
      if (cfg.sauceLabs) {
        cfg.sauceLabs.testName =
          'Interface "' + MOCHA_TEST + '" Integration Tests';
      }
      cfg.files = [
        'test/browser-fixtures/' + MOCHA_TEST + '.fixture.js',
        'test/interfaces/' + MOCHA_TEST + '.spec.js'
      ];
      break;

    case 'esm':
      // for now we will only run against Chrome to test this.
      if (cfg.sauceLabs) {
        cfg.sauceLabs.testName = 'ESM Integration Tests';
        cfg.browsers = ['chrome@latest'];
        var launcher = cfg.customLaunchers['chrome@latest'];
        cfg.customLaunchers = {
          'chrome@latest': launcher
        };
      } else if (!env.TRAVIS) {
        cfg.browsers = ['Chrome'];
      } else {
        console.error(
          'skipping ESM tests & exiting; no SauceLabs nor local run detected');
        process.exit(0);
      }
      cfg.files = [
        'test/browser-fixtures/esm.fixture.html',
        'test/browser-specific/esm.spec.js'
      ];
      break;
    default:
      if (cfg.sauceLabs) {
        cfg.sauceLabs.testName = 'Unit Tests';
      }
  }

  config.set(cfg);
};

function addSauceTests (cfg) {
  cfg.reporters.push('saucelabs');
  var browsers = Object.keys(browserPlatformPairs);
  cfg.browsers = cfg.browsers.concat(browsers);
  cfg.customLaunchers = browsers.reduce(function (acc, browser) {
    var platform = browserPlatformPairs[browser];
    var browserParts = browser.split('@');
    var browserName = browserParts[0];
    var version = browserParts[1];
    acc[browser] = {
      base: 'SauceLabs',
      browserName: browserName,
      version: version,
      platform: platform
    };
    return acc;
  }, {});

  // See https://github.com/karma-runner/karma-sauce-launcher
  // See https://github.com/bermi/sauce-connect-launcher#advanced-usage
  Object.assign(cfg.sauceLabs, {
    public: 'public',
    connectOptions: {
      connectRetries: 2,
      connectRetryTimeout: 30000,
      detached: cfg.sauceLabs.startConnect,
      tunnelIdentifier: cfg.sauceLabs.tunnelIdentifier
    }
  });

  cfg.concurrency = Infinity;
  cfg.retryLimit = 1;

  // for slow browser booting, ostensibly
  cfg.captureTimeout = 120000;
  cfg.browserNoActivityTimeout = 20000;
}
