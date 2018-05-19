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
  return `${
    process.env.COVERAGE ? coverageCommand : ''
  } ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
  scripts: {
    build: {
      script: `browserify ./browser-entry --plugin ./scripts/dedefine --ignore 'fs' --ignore 'glob' --ignore 'path' --ignore 'supports-color' > mocha.js`,
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
        script: 'markdownlint "*.md" "docs/**/*.md" ".github/*.md"',
        description: 'Run markdownlint linter'
      }
    },
    reformat: {
      script:
        'prettier-eslint --write "*.js" "lib/**/*.js" "test/**/*.js" "bin/*" "scripts/*"',
      description: 'Reformat codebase with Prettier'
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
            '"test/unit/*.spec.js" "test/node-unit/*.spec.js" --growl'
          ),
          description: 'Run Node.js unit tests'
        },
        integration: {
          script: test(
            'integration',
            '--timeout 5000 --slow 500 "test/integration/*.spec.js"'
          ),
          description: 'Run Node.js integration tests',
          hiddenFromHelp: true
        },
        jsapi: {
          script: 'node test/jsapi',
          description: 'Run Node.js Mocha JavaScript API tests',
          hiddenFromHelp: true
        },
        compilers: {
          default: {
            script:
              'nps test.node.compilers.coffee test.node.compilers.custom test.node.compilers.multiple',
            description: 'Run Node.js --compilers flag tests (deprecated)',
            hiddenFromHelp: true
          },
          coffee: {
            script: test(
              'compilers-coffee',
              '--compilers coffee:coffee-script/register test/compiler'
            ),
            description:
              'Run Node.js coffeescript compiler tests using --compilers flag (deprecated)',
            hiddenFromHelp: true
          },
          custom: {
            script: test(
              'compilers-custom',
              '--compilers foo:./test/compiler-fixtures/foo.fixture test/compiler'
            ),
            description:
              'Run Node.js custom compiler tests using --compilers flag (deprecated)',
            hiddenFromHelp: true
          },
          multiple: {
            script: test(
              'compilers-multiple',
              '--compilers coffee:coffee-script/register,foo:./test/compiler-fixtures/foo.fixture test/compiler'
            ),
            description:
              'Run Node.js multiple compiler tests using--compilers flag (deprecated)',
            hiddenFromHelp: true
          }
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
              'global-only-bdd',
              '--ui bdd test/only/global/bdd.spec'
            ),
            description: 'Run Node.js "global only" w/ BDD interface tests',
            hiddenFromHelp: true
          },
          globalTdd: {
            script: test(
              'global-only-tdd',
              '--ui tdd test/only/global/tdd.spec'
            ),
            description: 'Run Node.js "global only" w/ TDD interface tests',
            hiddenFromHelp: true
          },
          globalQunit: {
            script: test(
              'global-only-qunit',
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
          script: 'NODE_PATH=. karma start --single-run',
          description: 'Run browser unit tests'
        },
        bdd: {
          script: 'MOCHA_TEST=bdd nps test.browser.unit',
          description: 'Run browser BDD interface tests',
          hiddenFromHelp: true
        },
        tdd: {
          script: 'MOCHA_TEST=tdd nps test.browser.unit',
          description: 'Run browser TDD interface tests',
          hiddenFromHelp: true
        },
        qunit: {
          script: 'MOCHA_TEST=qunit nps test.browser.unit',
          description: 'Run browser QUnit interface tests',
          hiddenFromHelp: true
        },
        esm: {
          script: 'MOCHA_TEST=esm nps test.browser.unit',
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
    docs: {
      default: {
        script:
          'nps docs.prebuild && bundle exec jekyll build --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts && nps docs.postbuild',
        description: 'Build documentation'
      },
      prebuild: {
        script:
          'rimraf docs/_dist docs/api && node scripts/docs-update-toc.js && nps docs.api',
        description: 'Prepare system for doc building',
        hiddenFromHelp: true
      },
      postbuild: {
        script:
          'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js >> docs/_dist/_headers',
        description: 'Post-process docs after build',
        hiddenFromHelp: true
      },
      prewatch: {
        script: 'node scripts/docs-update-toc.js',
        description: 'Prepare system for doc building w/ watch',
        hiddenFromHelp: true
      },
      watch: {
        script:
          'nps docs.prewatch && bundle exec jekyll serve --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts --watch',
        description: 'Watch docs for changes & build'
      },
      api: {
        script:
          'mkdirp docs/api && jsdoc -c jsdoc.conf.json && cp LICENSE docs/api',
        description: 'build api docs'
      }
    },
    updateContributors: {
      script: 'node scripts/update-contributors.js',
      description: 'Update list of contributors in package.json'
    }
  }
};
