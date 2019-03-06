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
  const coverageCommand = `nyc --no-clean --report-dir coverage/reports/${testName}`;
  const mochaCommand = `node ${path.join('bin', 'mocha')}`; // Include 'node' and path.join for Windows compatibility
  if (process.env.CI && !/^only-/.test(testName)) {
    mochaParams += ' --forbid-only';
  }
  return `${
    process.env.COVERAGE ? coverageCommand : ''
  } ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
  scripts: {
    build: {
      script: `browserify -e browser-entry.js --plugin ./scripts/dedefine --ignore 'fs' --ignore 'glob' --ignore 'path' --ignore 'supports-color' -o mocha.js`,
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
        script: 'nps lint test.node test.browser test.bundle',
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
            'test.node.only',
            'test.node.opts'
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
            '--timeout 10000 --slow 3750 "test/integration/**/*.spec.js"'
          ),
          description: 'Run Node.js integration tests',
          hiddenFromHelp: true
        },
        opts: {
          script: test(
            'opts',
            '--opts test/opts/mocha.opts test/opts/opts.spec.js --no-config'
          ),
          description: 'Run tests concerning mocha.opts',
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
            script: test('only-bdd', '--ui bdd test/only/bdd.spec'),
            description: 'Run Node.js "only" w/ BDD interface tests',
            hiddenFromHelp: true
          },
          tdd: {
            script: test('only-tdd', '--ui tdd test/only/tdd.spec'),
            description: 'Run Node.js "only" w/ TDD interface tests',
            hiddenFromHelp: true
          },
          bddRequire: {
            script: test(
              'only-bdd-require',
              '--ui qunit test/only/bdd-require.spec'
            ),
            description: 'Run Node.js "only" w/ QUnit interface tests',
            hiddenFromHelp: true
          },
          globalBdd: {
            script: test(
              'only-global-bdd',
              '--ui bdd test/only/global/bdd.spec'
            ),
            description: 'Run Node.js "global only" w/ BDD interface tests',
            hiddenFromHelp: true
          },
          globalTdd: {
            script: test(
              'only-global-tdd',
              '--ui tdd test/only/global/tdd.spec'
            ),
            description: 'Run Node.js "global only" w/ TDD interface tests',
            hiddenFromHelp: true
          },
          globalQunit: {
            script: test(
              'only-global-qunit',
              '--ui qunit test/only/global/qunit.spec'
            ),
            description: 'Run Node.js "global only" w/ QUnit interface tests',
            hiddenFromHelp: true
          }
        }
      },
      browser: {
        default: {
          script:
            'nps clean build test.browser.unit test.browser.bdd test.browser.tdd test.browser.qunit test.browser.esm',
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
        }
      },
      bundle: {
        default: {
          script: 'nps clean build test.bundle.amd',
          description: 'Run bundle-related tests'
        },
        amd: {
          script: test('amd', 'test/bundle/amd.spec'),
          description: 'Run AMD bundle tests',
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
          'nps docs.prebuild && eleventy && nps docs.postbuild && nps docs.api',
        description: 'Build documentation'
      },
      prebuild: {
        script: 'rimraf docs/_dist docs/_site && nps docs.preprocess',
        description: 'Prepare system for doc building',
        hiddenFromHelp: true
      },
      postbuild: {
        script:
          'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js >> docs/_dist/_headers',
        description: 'Post-process docs after build',
        hiddenFromHelp: true
      },
      preprocess: {
        default: {
          script:
            'md-magic --config ./scripts/markdown-magic.config.js --path docs/index.md',
          description: 'Preprocess documentation',
          hiddenFromHelp: true
        },
        api: {
          script:
            'md-magic --config ./scripts/markdown-magic.config.js --path "docs/api-tutorials/*.md"',
          description: 'Preprocess API documentation',
          hiddenFromHelp: true
        }
      },
      watch: {
        script: 'nps docs.preprocess && eleventy --serve',
        description: 'Watch docs for changes & build'
      },
      api: {
        script:
          'nps docs.preprocess.api && jsdoc -c jsdoc.conf.json && cp LICENSE docs/_dist/api',
        description: 'Build API docs'
      }
    },
    updateContributors: {
      script: 'contributors',
      description: 'Update list of contributors in package.json'
    },
    linkifyChangelog: {
      script: 'node scripts/linkify-changelog.js',
      description: 'Add/update GitHub links in CHANGELOG.md'
    },
    version: {
      script:
        'nps updateContributors && nps linkifyChangelog && git add -A ./package.json ./CHANGELOG.md',
      description: 'Tasks to perform when `npm version` is run'
    }
  }
};
