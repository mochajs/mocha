'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const baseBundleDirpath = path.join(__dirname, '.karma');

const browserPlatformPairs = {
  'chrome@latest': 'Windows 8',
  'MicrosoftEdge@latest': 'Windows 10',
  'internet explorer@11.0': 'Windows 8.1',
  'firefox@latest': 'Windows 10',
  'safari@latest': 'OS X 10.12'
};

module.exports = config => {
  let bundleDirpath;
  const cfg = {
    frameworks: ['browserify', 'mocha'],
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
      configure: function configure(b) {
        b
          .ignore('glob')
          .ignore('fs')
          .ignore('path')
          .ignore('supports-color')
          .on('bundled', (err, content) => {
            if (err) {
              throw err;
            }
            if (bundleDirpath) {
              // write bundle to directory for debugging
              fs.writeFileSync(
                path.join(bundleDirpath, `mocha.${Date.now()}.js`),
                content
              );
            }
          });
      }
    },
    reporters: ['mocha'],
    colors: true,
    browsers: ['ChromeHeadless'],
    logLevel: config.LOG_INFO,
    client: {
      mocha: {
        reporter: 'html',
        timeout: 500
      }
    },
    mochaReporter: {
      showDiff: true
    },
    customLaunchers: {
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333']
      }
    }
  };

  // TO RUN AGAINST SAUCELABS LOCALLY, execute:
  // `CI=1 SAUCE_USERNAME=<user> SAUCE_ACCESS_KEY=<key> npm start test.browser`
  const env = process.env;
  let sauceConfig;

  if (env.CI) {
    console.error('CI mode enabled');
    if (env.TRAVIS) {
      console.error('Travis-CI detected');
      bundleDirpath = path.join(baseBundleDirpath, process.env.TRAVIS_BUILD_ID);
      if (env.SAUCE_USERNAME && env.SAUCE_ACCESS_KEY) {
        // correlate build/tunnel with Travis
        sauceConfig = {
          build: `TRAVIS #${env.TRAVIS_BUILD_NUMBER} (${env.TRAVIS_BUILD_ID})`,
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
        const id = `${require('os').hostname()} (${Date.now()})`;
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
  const MOCHA_TEST = env.MOCHA_TEST;
  switch (MOCHA_TEST) {
    case 'bdd':
    case 'tdd':
    case 'qunit':
      if (cfg.sauceLabs) {
        cfg.sauceLabs.testName = `Interface "${MOCHA_TEST}" Integration Tests`;
      }
      cfg.files = [
        `test/browser-fixtures/${MOCHA_TEST}.fixture.js`,
        `test/interfaces/${MOCHA_TEST}.spec.js`
      ];
      break;

    case 'esm':
      // just run against ChromeHeadless, since other browsers may not
      // support
      cfg.browsers = ['ChromeHeadless'];
      cfg.files = [
        'test/browser-specific/esm.spec.js',
        'test/browser-fixtures/esm.fixture.html'
      ];
      break;
    default:
      if (cfg.sauceLabs) {
        cfg.sauceLabs.testName = 'Unit Tests';
      }
  }

  cfg.files.unshift(
    'node_modules/unexpected/unexpected.js',
    {pattern: 'node_modules/unexpected/unexpected.js.map', included: false},
    'test/browser-specific/setup.js'
  );

  config.set(cfg);
};

function addSauceTests(cfg) {
  cfg.reporters.push('saucelabs');
  const browsers = Object.keys(browserPlatformPairs);
  cfg.browsers = cfg.browsers.concat(browsers);
  cfg.customLaunchers = browsers.reduce((acc, browser) => {
    const platform = browserPlatformPairs[browser];
    const [browserName, version] = browser.split('@');
    acc[browser] = {
      base: 'SauceLabs',
      browserName: browserName,
      version: version,
      platform: platform
    };
    return acc;
  }, cfg.customLaunchers);

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
