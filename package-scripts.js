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
  if (process.env.TRAVIS) {
    mochaParams += ' --color'; // force color in travis-ci
  }
  return `${
    process.env.COVERAGE ? coverageCommand : ''
  } ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
  scripts: {
    build: {
      script: `rollup -c`,
      description: 'Build browser bundle'
    },
    lint: {
      default: {
        script: 'nps lint.code lint.markdown',
        description: 'Lint code and Markdown documentation'
      },
      code: {
        script: 'eslint . "bin/*"',
        description: 'Run ESLint linter'
      },
      markdown: {
        script:
          'markdownlint "*.md" "docs/**/*.md" ".github/*.md" "lib/**/*.md" "test/**/*.md" "example/**/*.md"',
        description: 'Run markdownlint linter'
      }
    },
    format: {
      default: {
        script: 'nps format.eslint && nps format.prettier',
        default: 'Format codebase w/ ESLint and Prettier'
      },
      eslint: {
        script: 'eslint --fix . "bin/*"',
        description: 'Format JavaScript files',
        hiddenFromHelp: true
      },
      prettier: {
        script:
          'prettier --write "!(package*).json" ".*.json" "lib/**/*.json" "*.yml"',
        description: 'Format JSON & YAML files',
        hiddenFromHelp: true
      }
    },
    clean: {
      script: 'rimraf mocha.js',
      description: 'Clean browser bundle'
    },
    test: {
      default: {
        script: 'nps lint test.node test.browser',
        description: 'Run all linters and all tests'
      },
      node: {
        default: {
          script: `rimraf .nyc_output && nps ${[
            'build',
            'test.node.bdd',
            'test.node.tdd',
            'test.node.qunit',
            'test.node.exports',
            'test.node.unit',
            'test.node.integration',
            'test.node.jsapi',
            'test.node.requires',
            'test.node.reporters',
            'test.node.only'
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
          description: 'Run Node.js QUnit interace tests',
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
            '"test/unit/*.spec.js" "test/node-unit/**/*.spec.js" --growl'
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
              '--require coffee-script/register',
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
              'test.node.only.bdd',
              'test.node.only.tdd',
              'test.node.only.bddRequire',
              'test.node.only.globalBdd',
              'test.node.only.globalTdd',
              'test.node.only.globalQunit'
            ].join(' ')}   `,
            description: 'Run Node.js "only" functionality tests',
            hiddenFromHelp: true
          },
          bdd: {
            script: test(
              'only-bdd',
              '--ui bdd test/only/bdd.spec --no-parallel'
            ),
            description: 'Run Node.js "only" w/ BDD interface tests',
            hiddenFromHelp: true
          },
          tdd: {
            script: test(
              'only-tdd',
              '--ui tdd test/only/tdd.spec --no-parallel'
            ),
            description: 'Run Node.js "only" w/ TDD interface tests',
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
      browser: {
        default: {
          script:
            'nps clean build test.browser.unit test.browser.bdd test.browser.tdd test.browser.qunit test.browser.esm test.browser.requirejs',
          description: 'Run browser tests'
        },
        unit: {
          script: 'cross-env NODE_PATH=. karma start --single-run',
          description: 'Run browser unit tests'
        },
        bdd: {
          script: 'cross-env MOCHA_TEST=bdd nps test.browser.unit',
          description: 'Run browser BDD interface tests',
          hiddenFromHelp: true
        },
        tdd: {
          script: 'cross-env MOCHA_TEST=tdd nps test.browser.unit',
          description: 'Run browser TDD interface tests',
          hiddenFromHelp: true
        },
        qunit: {
          script: 'cross-env MOCHA_TEST=qunit nps test.browser.unit',
          description: 'Run browser QUnit interface tests',
          hiddenFromHelp: true
        },
        esm: {
          script: 'cross-env MOCHA_TEST=esm nps test.browser.unit',
          description: 'Run browser ES modules support test',
          hiddenFromHelp: true
        },
        requirejs: {
          script: 'cross-env MOCHA_TEST=requirejs nps test.browser.unit',
          description: 'Run RequireJS compat test',
          hiddenFromHelp: true
        }
      }
    },
    coveralls: {
      script: 'nyc report --reporter=text-lcov | coveralls',
      description: 'Send code coverage report to coveralls (run during CI)',
      hiddenFromHelp: true
    },
    'coverage-report': {
      script: 'nyc report --reporter=html',
      description:
        'Output HTML coverage report to coverage/index.html (run tests with COVERAGE=1 first)'
    },
    docs: {
      default: {
        script:
          'nps docs.prebuild && nps docs.api && eleventy && nps docs.linkcheck && node scripts/netlify-headers.js docs/_site >> docs/_site/_headers',
        description: 'Build documentation'
      },
      production: {
        script: 'nps docs && nps docs.postbuild',
        description: 'Build docs for production'
      },
      prebuild: {
        script: 'rimraf docs/_dist docs/_site',
        description: 'Prepare system for doc building',
        hiddenFromHelp: true
      },
      linkcheck: {
        script:
          'hyperlink -ri --canonicalroot https://mochajs.org --skip ".js.html#line" docs/_site/index.html --todo "HTTP 429 Too Many Requests"'
      },
      postbuild: {
        script:
          'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js docs/_dist >> docs/_dist/_headers',
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
    },
    updateAuthors: {
      script: 'node scripts/update-authors.js',
      description: 'Update list of AUTHORS'
    },
    linkifyChangelog: {
      script: 'node scripts/linkify-changelog.js',
      description: 'Add/update GitHub links in CHANGELOG.md'
    },
    version: {
      script:
        'nps updateAuthors && nps linkifyChangelog && git add -A ./AUTHORS ./CHANGELOG.md',
      description: 'Tasks to perform when `npm version` is run'
    }
  }
};
