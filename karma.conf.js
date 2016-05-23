'use strict';

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
    if (!(process.env.SAUCE_USERNAME || process.env.SAUCE_ACCESS_KEY)) {
      throw new Error('Must set SAUCE_USERNAME and SAUCE_ACCESS_KEY '
        + 'environment variables!');
    }
    cfg.reporters.push('saucelabs');
    cfg.browsers.push('ie8');
    cfg.customLaunchers = {
      ie8: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '8.0'
      }
    };

    cfg.sauceLabs = {
      public: 'public'
    };

    if (process.env.TRAVIS) {
      // correlate build/tunnel with Travis
      cfg.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER
        + ' (' + process.env.TRAVIS_BUILD_ID + ')';
      cfg.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
      cfg.sauceLabs.startConnect = false;
    } else {
      // otherwise just make something up
      cfg.sauceLabs.build = require('os').hostname() + ' (' + Date.now() + ')';
    }

    // for slow browser booting, ostensibly
    cfg.captureTimeout = 120000;
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
