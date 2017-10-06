'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var baseBundleDirpath = path.join(__dirname, '.karma');

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
    browserify: {
      debug: true,
      configure: function configure (b) {
        b.ignore('glob')
          .ignore('fs')
          .ignore('path')
          .ignore('supports-color')
          .require(path.join(__dirname, 'node_modules', 'buffer'), {expose: 'buffer'})
          .on('bundled', function (err, content) {
            if (!err && bundleDirpath) {
              // write bundle to directory for debugging
              fs.writeFileSync(path.join(bundleDirpath,
                'bundle.' + Date.now() + '.js'), content);
            }
          });
      }
    },
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

  // see https://github.com/saucelabs/karma-sauce-example

  // We define the browser to run on the Saucelabs Infrastructure
  // via the environment variables BROWSER and PLATFORM.
  // PLATFORM is e.g. "Windows"
  // BROWSER is expected to be in the format "<name>@<version>",
  // e.g. "MicrosoftEdge@latest"
  // See https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  // for available browsers.

  // TO RUN LOCALLY, execute:
  // `CI=1 SAUCE_USERNAME=<user> SAUCE_ACCESS_KEY=<key> BROWSER=<browser> PLATFORM=<platform> make test-browser`
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
          build: 'TRAVIS #' + env.TRAVIS_BUILD_NUMBER +
            ' (' + env.TRAVIS_BUILD_ID + ')',
          tunnelIdentifier: env.TRAVIS_JOB_NUMBER,
          startConnect: false
        };
        console.error('Configured SauceLabs');
      } else {
        console.error('No SauceLabs credentials present');
      }
    } else if (env.APPVEYOR) {
      console.error('AppVeyor detected');
      bundleDirpath = path.join(baseBundleDirpath, process.env.APPVEYOR_BUILD_ID);
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

  // the MOCHA_UI env var will determine if we're running interface-specific
  // tests.  since you can only load one at a time, each must be run separately.
  // each has its own set of acceptance tests and a fixture.
  // the "bdd" fixture is used by default.
  var ui = env.MOCHA_UI;
  if (ui) {
    if (cfg.sauceLabs) {
      cfg.sauceLabs.testName = 'Interface "' + ui + '" integration tests';
    }
    cfg.files = [
      'test/browser-fixtures/' + ui + '.fixture.js',
      'test/interfaces/' + ui + '.spec.js'
    ];
  } else if (cfg.sauceLabs) {
    cfg.sauceLabs.testName = 'Unit Tests';
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
