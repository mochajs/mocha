'use strict';

module.exports = () => {
  return {
    files: [
      'index.js',
      'lib/**/*.{js,json}',
      'test/setup.js',
      'test/assertions.js',
      {
        pattern: 'test/node-unit/**/*.fixture.js',
        instrument: false
      },
      {
        pattern: 'test/unit/**/*.fixture.js',
        instrument: false
      },
      'package.json',
      'test/opts/mocha.opts',
      'mocharc.yml'
    ],
    filesWithNoCoverageCalculated: [
      'test/**/*.fixture.js',
      'test/setup.js',
      'test/assertions.js',
      'lib/browser/**/*.js'
    ],
    tests: ['test/unit/**/*.spec.js', 'test/node-unit/**/*.spec.js'],
    env: {
      type: 'node',
      runner: 'node'
    },
    workers: {recycle: true},
    testFramework: {type: 'mocha', path: __dirname},
    setup(wallaby) {
      // running mocha instance is not the same as mocha under test,
      // running mocha is the project's source code mocha, mocha under test is instrumented version of the source code
      const runningMocha = wallaby.testFramework;
      runningMocha.timeout(1000);
      // to expose it/describe etc. on the mocha under test
      const MochaUnderTest = require('./');
      const mochaUnderTest = new MochaUnderTest();
      mochaUnderTest.suite.emit(
        MochaUnderTest.Suite.constants.EVENT_FILE_PRE_REQUIRE,
        global,
        '',
        mochaUnderTest
      );
      require('./test/setup');
    },
    debug: true
  };
};
