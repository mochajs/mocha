'use strict';

function addSauceTests(cfg) {
  cfg.reporters.push('saucelabs');
  cfg.customLaunchers = {
    ie8: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '8.0'
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
    public: 'public'
  };

  // for slow browser booting, ostensibly
  cfg.captureTimeout = 120000;
}

module.exports = function(config) {
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
          .ignore('jade')
          .ignore('supports-color')
          .exclude('./lib-cov/mocha');
      }
    },
    reporters: ['spec'],
    colors: true,
    browsers: ['PhantomJS'],
    logLevel: config.LOG_INFO,
    singleRun: true
  };

  // see https://github.com/saucelabs/karma-sauce-example
  // TO RUN LOCALLY:
  // Execute `CI=1 make test-browser`, once you've set the SAUCE_USERNAME and
  // SAUCE_ACCESS_KEY env vars.
  if (process.env.CI) {
    // we can't run SauceLabs tests on PRs from forks on Travis cuz security.
    if (process.env.TRAVIS) {
      if (process.env.TRAVIS_REPO_SLUG === 'mochajs/mocha'
        && process.env.TRAVIS_PULL_REQUEST === 'false') {
        addSauceTests(cfg);
        // correlate build/tunnel with Travis
        cfg.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER
          + ' (' + process.env.TRAVIS_BUILD_ID + ')';
        cfg.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        cfg.sauceLabs.startConnect = true;
      }
    } else {
      if (!(process.env.SAUCE_USERNAME || process.env.SAUCE_ACCESS_KEY)) {
        throw new Error('Must set SAUCE_USERNAME and SAUCE_ACCESS_KEY '
          + 'environment variables!');
      }

      // remember, this is for a local run.
      addSauceTests(cfg);
      cfg.sauceLabs.build = require('os').hostname() + ' (' + Date.now() + ')';
    }
  }

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
      'test/browser-fixtures/' + ui + '.js',
      'test/acceptance/interfaces/' + ui + '.js'
    ];
  } else if (cfg.sauceLabs) {
    cfg.sauceLabs.testName = 'Unit Tests';
  }

  config.set(cfg);
};
