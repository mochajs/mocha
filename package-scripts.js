'use strict';

const path = require('path');

/**
 * Generates a command to run mocha tests with or without test coverage
 * as desired for the current runmode.
 * @param {string} testName The name of the test to be used for coverage reporting.
 * @param {string} mochaParams Parameters for the mocha CLI to execute the desired test.
 * @returns {string} Command string to be executed by nps.
 */
function test(testName, mochaParams) {
  let coverageCommand = `nyc --no-clean --report-dir="coverage/reports/${testName}"`;
  const mochaCommand = `node ${path.join('bin', 'mocha')}`; // Include 'node' and path.join for Windows compatibility
  if (process.env.CI) {
    // suppress coverage summaries in CI to reduce noise
    coverageCommand += ' --reporter=json';
    if (!/^only-/.test(testName)) {
      mochaParams += ' --forbid-only';
    }
  }
  // this may _actually_ be supported in the future
  if (process.env.MOCHA_PARALLEL === '0') {
    mochaParams += ' --no-parallel';
  }
  if (process.env.MOCHA_REPORTER) {
    mochaParams += ` --reporter=${process.env.MOCHA_REPORTER}`;
  }
  if (process.env.CI) {
    mochaParams += ' --color'; // force color in CI
  }
  return `${
    process.env.COVERAGE ? coverageCommand : ''
  } ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
  scripts: {
    testNode: {
      default: {
        script: `nps ${[
          'testNode.bdd',
          'testNode.tdd',
          'testNode.qunit',
          'testNode.exports',
          'testNode.unit',
          'testNode.integration',
          'testNode.jsapi',
          'testNode.requires',
          'testNode.reporters',
          'testNode.only'
        ].join(' ')}`,
        description: 'Run Node.js tests'
      },
      bdd: {
        script: test('bdd', '--ui bdd test/interfaces/bdd.spec'),
        description: 'Run Node.js BDD interface tests',
        hiddenFromHelp: true
      },
      tdd: {
        script: test('tdd', '--ui tdd test/interfaces/tdd.spec'),
        description: 'Run Node.js TDD interface tests',
        hiddenFromHelp: true
      },
      qunit: {
        script: test('qunit', '--ui qunit test/interfaces/qunit.spec'),
        description: 'Run Node.js QUnit interface tests',
        hiddenFromHelp: true
      },
      exports: {
        script: test('exports', '--ui exports test/interfaces/exports.spec'),
        description: 'Run Node.js exports interface tests',
        hiddenFromHelp: true
      },
      unit: {
        script: test(
          'unit',
          '"test/unit/*.spec.js" "test/node-unit/**/*.spec.js"'
        ),
        description: 'Run Node.js unit tests'
      },
      integration: {
        script: test(
          'integration',
          '--parallel --timeout 10000 --slow 3750 "test/integration/**/*.spec.js"'
        ),
        description: 'Run Node.js integration tests',
        hiddenFromHelp: true
      },
      jsapi: {
        script: 'node test/jsapi',
        description: 'Run Node.js Mocha JavaScript API tests',
        hiddenFromHelp: true
      },
      requires: {
        script: test(
          'requires',
          [
            '--require coffeescript/register',
            '--require test/require/a.js',
            '--require test/require/b.coffee',
            '--require test/require/c.js',
            '--require test/require/d.coffee',
            'test/require/require.spec.js'
          ].join(' ')
        ),
        description: 'Run Node.js --require flag tests',
        hiddenFromHelp: true
      },
      reporters: {
        script: test('reporters', '--timeout 500 "test/reporters/*.spec.js"'),
        description: 'Run Node.js reporter tests',
        hiddenFromHelp: true
      },
      only: {
        default: {
          script: `nps ${[
            'testNode.only.bddRequire',
            'testNode.only.globalBdd',
            'testNode.only.globalTdd',
            'testNode.only.globalQunit'
          ].join(' ')}   `,
          description: 'Run Node.js "only" functionality tests',
          hiddenFromHelp: true
        },
        bddRequire: {
          script: test(
            'only-bdd-require',
            '--ui qunit test/only/bdd-require.spec --no-parallel'
          ),
          description: 'Run Node.js "only" w/ QUnit interface tests',
          hiddenFromHelp: true
        },
        globalBdd: {
          script: test(
            'only-global-bdd',
            '--ui bdd test/only/global/bdd.spec --no-parallel'
          ),
          description: 'Run Node.js "global only" w/ BDD interface tests',
          hiddenFromHelp: true
        },
        globalTdd: {
          script: test(
            'only-global-tdd',
            '--ui tdd test/only/global/tdd.spec --no-parallel'
          ),
          description: 'Run Node.js "global only" w/ TDD interface tests',
          hiddenFromHelp: true
        },
        globalQunit: {
          script: test(
            'only-global-qunit',
            '--ui qunit test/only/global/qunit.spec --no-parallel'
          ),
          description: 'Run Node.js "global only" w/ QUnit interface tests',
          hiddenFromHelp: true
        }
      }
    },
    'coverage-report-lcov': {
      script: 'nyc report --reporter=lcov',
      description: 'Write LCOV report to disk (run tests with COVERAGE=1 first)'
    },
    // 'coverage-report': {
    //   script: 'nyc report --reporter=html',
    //   description:
    //     'Output HTML coverage report to coverage/index.html (run tests with COVERAGE=1 first)'
    // },
    docs: {
      default: {
        script:
          'nps docs.clean && nps docs.api && eleventy',
        description: 'Build documentation'
      },
      production: {
        script: 'nps docs && nps docs.postbuild',
        description: 'Build docs for production'
      },
      clean: {
        script: 'rimraf docs/_dist docs/_site docs/api',
        description: 'Prepare system for doc building',
        hiddenFromHelp: true
      },
      postbuild: {
        script:
          'node node_modules/assetgraph-builder/bin/buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers',
        description: 'Post-process docs after build',
        hiddenFromHelp: true
      },
      watch: {
        script: 'eleventy --serve',
        description: 'Watch docs for changes & build'
      },
      api: {
        script: 'jsdoc -c jsdoc.conf.json',
        description: 'Build API docs'
      }
    }
  }
};
