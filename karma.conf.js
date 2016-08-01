'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var baseBundleDirpath = path.join(__dirname, '.karma');

module.exports = function(config) {
  var bundleDirpath;
  var cfg = {
    frameworks: [
      'browserify',
      'expect',
      'mocha'
    ],
    files: [
      'test/browser-fixtures/bdd.js',
      'test/acceptance/*.js'
    ],
    exclude: [
      'test/acceptance/http.js',
      'test/acceptance/fs.js',
      'test/acceptance/lookup-files.js',
      'test/acceptance/require/**/*.js',
      'test/acceptance/misc/**/*.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      configure: function configure(b) {
        b.ignore('glob')
          .ignore('fs')
          .ignore('path')
          .ignore('supports-color')
          .on('bundled', function(err, content) {
            if (!err && bundleDirpath) {
              // write bundle to directory for debugging
              fs.writeFileSync(path.join(bundleDirpath,
                'bundle.' + Date.now() + '.js'), content);
            }
          });
      }
    },
    reporters: ['spec'],
    colors: true,
    browsers: ['PhantomJS'],
    logLevel: config.LOG_INFO,
    singleRun: true
  };

  // see https://github.com/saucelabs/karma-sauce-example
  // TO RUN LOCALLY, execute:
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
          build: 'TRAVIS #' + env.TRAVIS_BUILD_NUMBER
          + ' (' + env.TRAVIS_BUILD_ID + ')',
          tunnelIdentifier: env.TRAVIS_JOB_NUMBER
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
      if (!(env.SAUCE_USERNAME || env.SAUCE_ACCESS_KEY)) {
        console.error('No SauceLabs credentials present');
      } else {
        sauceConfig = {
          build: require('os').hostname() + ' (' + Date.now() + ')'
        };
        console.error('Configured SauceLabs');
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
  // tets.  since you can only load one at a time, each must be run separately.
  // each has its own set of acceptance tests and a fixture.
  // the "bdd" fixture is used by default.
  var ui = env.MOCHA_UI;
  if (ui) {
    if (cfg.sauceLabs) {
      cfg.sauceLabs.testName = 'Interface "' + ui + '" integration tests';
    }
    cfg.files = [
      'test/browser-fixtures/' + ui + '.js',
      'test/acceptance/interfaces/' + ui + '.js'
    ];
  } else if (cfg.sauceLabs) {
    cfg.sauceLabs.testName = 'Unit Tests';
  }

  config.set(cfg);
};

function addSauceTests(cfg) {
  cfg.reporters.push('saucelabs');

  cfg.customLaunchers = {
    ie8: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '8.0'
    },
    ie7: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows XP',
      version: '7.0'
    },
    chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8',
      version: 'latest'
    },
    edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
      version: 'latest'
    },
    firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 8.1',
      version: 'latest'
    },
    safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: 'latest'
    }
  };

  cfg.browsers = cfg.browsers.concat(Object.keys(cfg.customLaunchers));

  cfg.sauceLabs = {
    public: 'public',
    startConnect: true
  };

  // for slow browser booting, ostensibly
  cfg.captureTimeout = 120000;
  cfg.browserNoActivityTimeout = 20000;
}
