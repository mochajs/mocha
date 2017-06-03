'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const baseBundleDirpath = path.join(__dirname, '.karma');
const osName = require('os-name');

/**
 * To run tests locally against SauceLabs, use:
 * `CI=1 SAUCE_USERNAME=<user> SAUCE_ACCESS_KEY=<key> make test-browser`
 * Set `DEBUG=1` for extra debug info.
 */

/**
 * SauceLabs concurrency limit
 * @type {number}
 */
const CONCURRENCY = 30;

/**
 * Makes a browser object into a custom launcher string
 * @param {Object} browser - Object having `version` and `browserName` props
 * @returns {string} Custom launcher name
 */
function browserify (browser) {
  return `${browser.browserName}@${browser.version}`;
}

/**
 * Browser objects
 * @type {Object[]}
 */
const BROWSERS = [
  {
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 8'
  },
  {
    browserName: 'MicrosoftEdge',
    version: 'latest',
    platform: 'Windows 10'
  },
  {
    browserName: 'internet explorer',
    version: '11.0',
    platform: 'Windows 8.1'
  },
  {
    browserName: 'internet explorer',
    version: '10.0',
    platform: 'Windows 8'
  },
  {
    browserName: 'internet explorer',
    version: '9.0',
    platform: 'Windows 7'
  },
  {
    browserName: 'internet explorer',
    version: '8.0',
    platform: 'Windows 7'
  },
  {
    browserName: 'internet explorer',
    version: '7.0',
    platform: 'Windows XP'
  },
  {
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 8.1'
  },
  {
    browserName: 'safari',
    version: 'latest',
    platform: 'OS X 10.12'
  }
];

module.exports = function (config) {
  const env = process.env;

  /**
   * This is where the artifacts are output for uploading to S3.
   * It's used regardless of whether or not we upload anything.
   */
  let bundleDirpath;

  let cfg = {
    frameworks: [
      'browserify',
      'expect',
      'mocha'
    ],
    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-expect',
      'karma-mocha',
      'karma-spec-reporter',
      require.resolve('@mocha/karma-sauce-launcher')
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
          .on('bundled', function (err, content) {
            if (!err && bundleDirpath) {
              // write bundle to directory for debugging
              fs.writeFileSync(
                path.join(bundleDirpath, 'bundle.' + Date.now() + '.js'),
                content);
            }
          });
      }
    },
    reporters: ['spec'],
    colors: true, /* This is the default browser to run, locally.
     * Sierra is incompatible with PhantomJS 1.x
     */
    browsers: [
      osName() === 'macOS Sierra'
        ? 'Chrome'
        : 'PhantomJS'
    ],
    logLevel: env.DEBUG ? config.LOG_INFO : config.LOG_DEBUG,
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  };

  let useSauceLabs = false;

  if (env.CI) {
    console.error('CI mode enabled');
    if (env.TRAVIS) {
      console.error('Travis-CI detected');
      bundleDirpath = path.join(baseBundleDirpath, env.TRAVIS_BUILD_ID);
      useSauceLabs = env.SAUCE_USERNAME && env.SAUCE_ACCESS_KEY;
    } else if (env.APPVEYOR) {
      console.error('AppVeyor detected');
      bundleDirpath = path.join(baseBundleDirpath, env.APPVEYOR_BUILD_ID);
    } else {
      console.error('Developer environment detected');
      useSauceLabs = env.SAUCE_USERNAME && env.SAUCE_ACCESS_KEY;
    }
  }

  // artifacts go in here
  bundleDirpath = bundleDirpath || path.join(baseBundleDirpath, 'development');
  mkdirp.sync(bundleDirpath);

  if (useSauceLabs) {
    console.error('Configuring for SauceLabs');
    cfg = configureSauceLabs(cfg);
  } else {
    console.error('No SauceLabs credentials present');
    if (!env.TRAVIS && env.CI) {
      console.error('(add SAUCE_ACCESS_KEY and SAUCE_USERNAME to environment)');
    }
  }

  // the MOCHA_UI env const will determine if we're running interface-specific
  // tests.  since you can only load one at a time, each must be run separately.
  // each has its own set of acceptance tests and a fixture.
  // the "bdd" fixture is used by default.
  if (env.MOCHA_UI) {
    cfg.files = [
      `test/browser-fixtures/${env.MOCHA_UI}.fixture.js`,
      `test/interfaces/${env.MOCHA_UI}.spec.js`
    ];
  }

  config.set(cfg);
};

function configureSauceLabs (cfg, isTravis) {
  const env = process.env;
  // base opts shouldn't change
  const sauceConfig = {
    public: 'public',
    connectOptions: {
      connectRetries: 10,
      connectRetryTimeout: 60000
    }
  };

  if (isTravis) {
    // correlate build/tunnel with Travis
    Object.assign(sauceConfig, {
      build: `Travis-CI #${env.TRAVIS_BUILD_NUMBER} (${env.TRAVIS_BUILD_ID})`,
      tunnelIdentifier: env.TRAVIS_JOB_NUMBER,
      startConnect: false
    });
  } else {
    const hostname = require('os')
      .hostname();
    Object.assign(sauceConfig, {
      build: `${hostname} (${new Date()}))`,
      testName: 'browser tests: unit',
      tags: [
        'unit',
        'development',
        hostname
      ]
    });
  }

  if (env.MOCHA_UI) {
    sauceConfig.testName =
      `${sauceConfig.testName}: ${env.MOCHA_UI} integration`;
    sauceConfig.tags.push(env.MOCHA_UI);
  }

  cfg.sauceLabs = sauceConfig;

  // add sauce browser launchers
  cfg.customLaunchers = {};
  BROWSERS.forEach(browser => {
    cfg.customLaunchers[browserify(browser)] = Object.assign(browser, {
      base: 'SauceLabs'
    });
  });
  // add the launcher names to list of browsers to launch
  cfg.browsers.push(...Object.keys(cfg.customLaunchers));

  // add saucelabs reporter
  cfg.reporters.push('saucelabs');

  // for slow browser booting, ostensibly
  cfg.concurrency = CONCURRENCY;
  cfg.retryLimit = 5;
  cfg.captureTimeout = 120000;
  cfg.browserNoActivityTimeout = 40000;

  return cfg;
}
