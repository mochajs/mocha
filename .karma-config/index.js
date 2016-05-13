function getConfig() {
  var cfg = {
    frameworks: [
      'browserify',
      'should',
      'mocha'
    ],
    files: [
      './.karma-config/fixture.js',
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
    reporters: ['mocha-clean'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  };

  if (process.env.TRAVIS) {
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
      testName: 'Karma Tests',
      build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' ('
        + process.env.TRAVIS_BUILD_ID + ')',
      public: 'public',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    };
    // Debug logging into a file, that we print out at the end of the build.
    cfg.logLevel = 'DEBUG';
    cfg.browserNoActivityTimeout = 120000;
    cfg.captureTimeout = 0;
  }
  return cfg;
}

getConfig.uiFixturePaths = {
  bdd: './.karma-config/fixture-bdd.js',
  tdd: './.karma-config/fixture-tdd.js',
  exports: './.karma-config/fixture-exports.js',
  qunit: './.karma-config/fixture-qunit.js'
};

module.exports = getConfig;
