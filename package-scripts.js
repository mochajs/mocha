'use strict';

const path = require('path');

/**
 * Generates a command to run mocha tests with or without test coverage
 * as desired for the current runmode.
 * @param {string} testName The name of the test to be used for coverage reporting.
 * @param {string} mochaParams Parameters for the mocha CLI to execute the desired test.
 * @returns {string} Command string to be executed by nps.
 */
function test (testName, mochaParams) {
  const coverageCommand = `nyc --no-clean --report-dir coverage/reports/${testName}`;
  const mochaCommand = `node ${path.join('bin', 'mocha')}`; // Include 'node' and path.join for Windows compatibility
  return `${process.env.COVERAGE ? coverageCommand : ''} ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
  scripts: {
    build: `browserify ./browser-entry --plugin ./scripts/dedefine --ignore 'fs' --ignore 'glob' --ignore 'path' --ignore 'supports-color' > mocha.js`,
    lint: {
      default: 'nps lint.all',
      all: {
        script: 'nps lint.code lint.markdown',
        description: 'Lint code and markdown'
      },
      code: {
        script: 'eslint . "bin/*"',
        description: 'Run eslint on mocha JS code'
      },
      markdown: {
        script: 'markdownlint "*.md" "docs/**/*.md" ".github/*.md"',
        description: 'Lint Markdown files'
      }
    },
    clean: {
      script: 'rm -f mocha.js',
      description: 'Delete mocha.js build artifact'
    },
    test: {
      default: 'nps test.all',
      all: {
        script: 'nps lint.code test.node test.browser',
        description: 'Lint code and runs node / browser environment tests'
      },
      node: {
        default: 'nps test.node.all',
        all: {
          script: `nps ${[
            'test.node.bdd',
            'test.node.tdd',
            'test.node.qunit',
            'test.node.exports',
            'test.node.unit',
            'test.node.integration',
            'test.node.jsapi',
            'test.node.compilers',
            'test.node.requires',
            'test.node.reporters',
            'test.node.only'
          ].join(' ')}`,
          description: 'Run all tests for node environment'
        },
        bdd: {
          script: test('bdd', '--ui bdd test/interfaces/bdd.spec'),
          description: 'Test Node BDD interface'
        },
        tdd: {
          script: test('tdd', '--ui tdd test/interfaces/tdd.spec'),
          description: 'Test Node TDD interface'
        },
        qunit: {
          script: test('qunit', '--ui qunit test/interfaces/qunit.spec'),
          description: 'Test Node QUnit interace'
        },
        exports: {
          script: test('exports', '--ui exports test/interfaces/exports.spec'),
          description: 'Test Node exports interface'
        },
        unit: {
          script: test('unit', '"test/unit/*.spec.js" "test/node-unit/*.spec.js" --growl'),
          description: 'Run Node unit tests'
        },
        integration: {
          script: test('integration', '--timeout 5000 --slow 500 "test/integration/*.spec.js"'),
          description: 'Run Node integration tests'
        },
        jsapi: {
          script: 'node test/jsapi',
          description: 'Test Mocha JavaScript API'
        },
        compilers: {
          default: 'nps test.node.compilers.all',
          all: {
            script: 'nps test.node.compilers.coffee test.node.compilers.custom test.node.compilers.multiple',
            description: 'Test deprecated --compilers flag'
          },
          coffee: {
            script: test('compilers-coffee', '--compilers coffee:coffee-script/register test/compiler'),
            description: 'Run coffeescript compiler tests using deprecated --compilers flag'
          },
          custom: {
            script: test('compilers-custom', '--compilers foo:./test/compiler-fixtures/foo.fixture test/compiler'),
            description: 'Run custom compiler test using deprecated --compilers flag'
          },
          multiple: {
            script: test('compilers-multiple', '--compilers coffee:coffee-script/register,foo:./test/compiler-fixtures/foo.fixture test/compiler'),
            description: 'Test deprecated --compilers flag using multiple compilers'
          }
        },
        requires: {
          script: test('requires', ['--require coffee-script/register',
            '--require test/require/a.js',
            '--require test/require/b.coffee',
            '--require test/require/c.js',
            '--require test/require/d.coffee',
            'test/require/require.spec.js'].join(' ')),
          description: 'Test --require flag'
        },
        reporters: {
          script: test('reporters', '"test/reporters/*.spec.js"'),
          description: 'Test reporters'
        },
        only: {
          default: 'nps test.node.only.all',
          all: {
            script: `nps ${[
              'test.node.only.bdd',
              'test.node.only.tdd',
              'test.node.only.bddRequire',
              'test.node.only.globalBdd',
              'test.node.only.globalTdd',
              'test.node.only.globalQunit'
            ].join(' ')}   `,
            description: 'Run all tests for .only()'
          },
          bdd: {
            script: test('only-bdd', '--ui bdd test/only/bdd.spec'),
            description: 'Test .only() with BDD interface'
          },
          tdd: {
            script: test('only-tdd', '--ui tdd test/only/tdd.spec'),
            description: 'Test .only() with TDD interface'
          },
          bddRequire: {
            script: test('only-bdd-require', '--ui qunit test/only/bdd-require.spec'),
            description: 'Test .only() with require("mocha") interface'
          },
          globalBdd: {
            script: test('global-only-bdd', '--ui bdd test/only/global/bdd.spec'),
            description: 'Test .only() in root suite with BDD interface'
          },
          globalTdd: {
            script: test('global-only-tdd', '--ui tdd test/only/global/tdd.spec'),
            description: 'Test .only() in root suite with TDD interface'
          },
          globalQunit: {
            script: test('global-only-qunit', '--ui qunit test/only/global/qunit.spec'),
            description: 'Test .only() in root suite with QUnit interface'
          }
        }
      },
      browser: {
        default: 'nps test.browser.all',
        all: {
          script: 'nps clean build.mochajs test.browser.unit test.browser.bdd test.browser.tdd test.browser.qunit test.browser.esm',
          description: 'Compile Mocha and run all tests in browser environment'
        },
        unit: {
          script: 'NODE_PATH=. karma start --single-run',
          description: 'Run unit tests for Mocha in browser'
        },
        bdd: {
          script: 'MOCHA_TEST=bdd nps test.browser.unit',
          description: 'Test BDD interface in browser'
        },
        tdd: {
          script: 'MOCHA_TEST=tdd nps test.browser.unit',
          description: 'Test TDD interface in browser'
        },
        qunit: {
          script: 'MOCHA_TEST=qunit nps test.browser.unit',
          description: 'Test QUnit interface in browser'
        },
        esm: {
          script: 'MOCHA_TEST=esm nps test.browser.unit',
          description: 'Test mocha ESM support'
        }
      },
      nonTTY: {
        default: 'nps test.nonTTY.all',
        all: {
          script: 'nps test.nonTTY.dot test.nonTTY.list test.nonTTY.spec',
          description: 'Run all tests for non-TTY terminals'
        },
        dot: {
          script: test('non-tty-dot', '--reporter dot test/interfaces/bdd.spec 2>&1 > /tmp/dot.out && echo "dot:" && cat /tmp/dot.out'),
          description: 'Test non-TTY dot reporter'
        },
        list: {
          script: test('non-tty-list', '--reporter list test/interfaces/bdd.spec 2>&1 > /tmp/list.out && echo "list:" && cat /tmp/list.out'),
          description: 'Test non-TTY list reporter'
        },
        spec: {
          script: test('non-tty-dot', '--reporter spec test/interfaces/bdd.spec 2>&1 > /tmp/spec.out && echo "spec:" && cat /tmp/spec.out'),
          description: 'Test non-TTY spec reporter'
        }
      }
    },
    coveralls: {
      script: 'nyc report --reporter=text-lcov | coveralls',
      description: 'Send code coverage report to coveralls (run during CI)'
    },
    prebuildDocs: 'rm -rf docs/_dist && node scripts/docs-update-toc.js',
    buildDocs: {
      script: 'nps prebuildDocs && bundle exec jekyll build --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts && nps postbuildDocs',
      description: 'Build documentation'
    },
    postbuildDocs: 'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js >> docs/_dist/_headers',
    prewatchDocs: 'node scripts/docs-update-toc.js',
    watchDocs: {
      script: 'nps prewatchDocs && bundle exec jekyll serve --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts --watch',
      description: 'Watch documentation for changes'
    }
  }
};
