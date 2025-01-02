/**
 * Mocha's Karma config.
 *
 * IMPORTANT:
 * - Karma must _always_ be run with `NODE_PATH=.` where `.` is the project
 *   root; this allows `karma-mocha` to use our built version of Mocha
 * - You must build Mocha's browser bundle before running Karma. This is
 *   typically done automatically in `package-scripts.js`.
 *
 * There are actually several different configurations here depending on the
 * values of various environment variables (e.g., `MOCHA_TEST`, `CI`, etc.),
 * which is why it's so hairy.
 *
 * This code avoids mutating the configuration object (the `cfg` variable)
 * directly; instead, we create new objects/arrays. This makes it a little more
 * obvious what's happening, even though it's verbose.
 *
 * The main export is a function which Karma calls with a config object; the
 * final line of this function should be `config.set(cfg)` which registers the
 * configuration we've built.
 */

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const rollupPlugin = require('./scripts/karma-rollup-plugin');
const BASE_BUNDLE_DIR_PATH = path.join(__dirname, '.karma');
const env = process.env;
const hostname = os.hostname();
const BROWSER = env.BROWSER;

const SAUCE_BROWSER_PLATFORM_MAP = {
  'chrome@latest': 'Windows 10',
  'MicrosoftEdge@latest': 'Windows 10',
  'firefox@latest': 'Windows 10',
  'safari@latest': 'macOS 10.15'
};

const baseConfig = {
  frameworks: ['rollup', 'mocha'],
  files: [
    // we use the BDD interface for all of the tests that
    // aren't interface-specific.
    'test/unit/*.spec.js'
  ],
  plugins: [
    'karma-mocha',
    'karma-mocha-reporter',
    'karma-sauce-launcher',
    'karma-chrome-launcher',
    rollupPlugin
  ],
  rollup: {
    configFile: 'rollup.config.js',
    include: ['test/**']
  },
  reporters: ['mocha'],
  colors: true,
  browsers: ['ChromeHeadless'],
  client: {
    mocha: {
      // this helps debug
      reporter: 'html'
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

module.exports = config => {
  let bundleDirPath = path.join(BASE_BUNDLE_DIR_PATH, hostname);
  let cfg = {...baseConfig};

  // TO RUN AGAINST SAUCELABS LOCALLY, execute:
  // `CI=1 SAUCE_USERNAME=<user> SAUCE_ACCESS_KEY=<key> npm run test-browser`
  let sauceConfig;

  // configuration for CI mode
  if (env.CI) {
    console.error('CI mode enabled');
    if (env.GITHUB_RUN_ID) {
      console.error('Github Actions detected');
      const buildId = `github-${env.GITHUB_RUN_ID}_${env.GITHUB_RUN_NUMBER}`;
      bundleDirPath = path.join(BASE_BUNDLE_DIR_PATH, buildId);
      sauceConfig = {
        build: buildId
      };
    } else {
      console.error(`Local environment (${hostname}) detected`);
      // don't need to run sauce from Windows CI b/c travis does it.
      if (env.SAUCE_USERNAME || env.SAUCE_ACCESS_KEY) {
        const id = `${hostname} (${Date.now()})`;
        sauceConfig = {
          build: id,
          tunnelIdentifier: id
        };
        console.error('Configured SauceLabs');
      } else {
        console.error(
          'No SauceLabs credentials present; set SAUCE_USERNAME and SAUCE_ACCESS_KEY env vars'
        );
      }
    }
  }

  cfg = createBundleDir(cfg, bundleDirPath);
  cfg = addSauceTests(cfg, sauceConfig);
  cfg = chooseTestSuite(cfg, env.MOCHA_TEST);

  // include sourcemap
  cfg = {
    ...cfg,
    files: [...cfg.files, {pattern: './mocha.js.map', included: false}]
  };

  if (BROWSER) {
    cfg = {
      ...cfg,
      browsers: [BROWSER]
    };
  }

  config.set(cfg);
};

/**
 * Creates dir `bundleDirPath` if it does not exist; returns new Karma config
 * containing `bundleDirPath` for rollup plugin.
 *
 * If this fails, the rollup plugin will use a temp dir.
 * @param {object} cfg - Karma config.
 * @param {string} [bundleDirPath] - Path where the output bundle should live
 * @returns {object} - New Karma config
 */
const createBundleDir = (cfg, bundleDirPath) => {
  if (bundleDirPath) {
    try {
      fs.mkdirSync(bundleDirPath, {recursive: true});
      cfg = {
        ...cfg,
        rollup: {
          ...cfg.rollup,
          bundleDirPath
        }
      };
    } catch (ignored) {
      console.error(
        `Failed to create ${bundleDirPath}; using temp directory instead`
      );
    }
  }
  return {...cfg};
};

/**
 * Adds Saucelabs-specific config to a Karma config object.
 *
 * If `sauceLabs` parameter is falsy, just return a clone of the `cfg` parameter.
 *
 * @see https://github.com/karma-runner/karma-sauce-launcher
 * @see https://github.com/bermi/sauce-connect-launcher#advanced-usage
 * @param {object} cfg - Karma config
 * @param {object} [sauceLabs] - SauceLabs config
 * @returns {object} Karma config
 */
const addSauceTests = (cfg, sauceLabs) => {
  if (sauceLabs) {
    const sauceBrowsers = Object.keys(SAUCE_BROWSER_PLATFORM_MAP);

    // creates Karma `customLauncher` configs from `SAUCE_BROWSER_PLATFORM_MAP`
    const customLaunchers = sauceBrowsers.reduce((acc, sauceBrowser) => {
      const platformName = SAUCE_BROWSER_PLATFORM_MAP[sauceBrowser];
      const [browserName, browserVersion] = sauceBrowser.split('@');
      const result = {
        ...acc,
        [sauceBrowser]: {
          base: 'SauceLabs',
          browserName,
          browserVersion,
          platformName,
          'sauce:options': sauceLabs
        }
      };
      if (browserName === 'firefox') {
        result[sauceBrowser]['sauce:options']['moz:debuggerAddress'] = true;
      }
      return result;
    }, {});

    const result = {
      ...cfg,
      reporters: [...cfg.reporters, 'saucelabs'],
      browsers: [...cfg.browsers, ...sauceBrowsers],
      customLaunchers: {
        ...cfg.customLaunchers,
        ...customLaunchers
      },
      sauceLabs,
      concurrency: Infinity,
      retryLimit: 1,
      captureTimeout: 120000,
      browserNoActivityTimeout: 20000
    };
    return result;
  }
  return {...cfg};
};

/**
 * Returns a new Karma config containing standard dependencies for our tests.
 *
 * Most suites use this.
 * @param {object} cfg - Karma config
 * @returns {object} New Karma config
 */
const addStandardDependencies = cfg => ({
  ...cfg,
  files: [
    require.resolve('sinon/pkg/sinon.js'),
    require.resolve('unexpected/unexpected'),
    {
      pattern: require.resolve('unexpected/unexpected.js.map'),
      included: false
    },
    require.resolve('unexpected-sinon'),
    require.resolve('unexpected-eventemitter/dist/unexpected-eventemitter.js'),
    require.resolve('./test/browser-specific/setup'),
    ...cfg.files
  ],
  rollup: {
    ...cfg.rollup,
    external: [
      'sinon',
      'unexpected',
      'unexpected-eventemitter',
      'unexpected-sinon'
    ],
    globals: {
      sinon: 'sinon',
      unexpected: 'weknowhow.expect',
      'unexpected-sinon': 'weknowhow.unexpectedSinon',
      'unexpected-eventemitter': 'unexpectedEventEmitter'
    }
  }
});

/**
 * Adds a name for the tests, reflected in SauceLabs' UI. Returns new Karma
 * config.
 *
 * Does not add a test name if the `sauceLabs` prop of `cfg` is falsy (which
 * would imply that we're not running tests on SauceLabs).
 *
 * @param {string} testName - SauceLabs test name
 * @param {object} cfg - Karma config.
 * @returns {object} New Karma config
 */
const addSauceLabsTestName = (testName, cfg) =>
  cfg.sauceLabs
    ? {
        ...cfg,
        sauceLabs: {
          ...cfg.sauceLabs,
          testName
        }
      }
    : {...cfg};

/**
 * Returns a new Karma config to run with specific configuration (which cannot
 * be run with other configurations) as specified by `value`. Known values:
 *
 * - `bdd` - `bdd`-specific tests
 * - `tdd` - `tdd`-specific tests
 * - `qunit` - `qunit`-specific tests
 * - `esm` - ESM-specific tests
 *
 * Since we can't change Mocha's interface on-the-fly, tests for specific interfaces
 * must be run in isolation.
 * @param {object} cfg - Karma config
 * @param {string} [value] - Configuration identifier, if any
 * @returns {object} New Karma config
 */
const chooseTestSuite = (cfg, value) => {
  switch (value) {
    case 'bdd':
    case 'tdd':
    case 'qunit':
      return addStandardDependencies({
        ...cfg,
        ...addSauceLabsTestName(`Interface "${value}" Integration Tests`, cfg),
        files: [`test/interfaces/${value}.spec.js`],
        client: {
          ...cfg.client,
          mocha: {
            ...cfg.client.mocha,
            ui: value
          }
        }
      });
    case 'esm':
      return addStandardDependencies({
        ...addSauceLabsTestName('ESM Integration Tests', cfg),
        files: [
          {
            pattern: 'test/browser-specific/fixtures/esm.fixture.mjs',
            type: 'module'
          },
          {
            pattern: 'test/browser-specific/esm.spec.mjs',
            type: 'module'
          }
        ]
      });
    default:
      return addStandardDependencies({
        ...addSauceLabsTestName('Unit Tests', cfg)
      });
  }
};
