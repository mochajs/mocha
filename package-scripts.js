'use strict';

const BROWSERIFY = 'node_modules/.bin/browserify';
const KARMA = 'node_modules/.bin/karma';
const MOCHA = 'bin/mocha';
const NYC = 'node_modules/.bin/nyc';
const TM_BUNDLE = 'JavaScript\\ mocha.tmbundle';

const COVERAGE_ON = process.env.COVERAGE || process.argv.some((arg) => arg.toLowerCase().indexOf('coverage') !== -1);

function test (testName, params) {
  const prefix = COVERAGE_ON ? `${NYC} --no-clean --report-dir coverage/reports/${testName}` : '';
  return `${prefix} ${MOCHA} ${params}`;
}

module.exports = {
  scripts: {
    build: `${BROWSERIFY} ./browser-entry --plugin ./scripts/dedefine --ignore 'fs' --ignore 'glob' --ignore 'path' --ignore 'supports-color' > mocha.js`,
    lint: {
      default: 'nps lint.code lint.markdown',
      code: 'eslint . bin/*',
      markdown: 'markdownlint "*.md" "docs/**/*.md" ".github/*.md"'
    },
    clean: 'rm -f mocha.js',
    test: {
      default: 'nps lint.code test.node test.browser',
      node: {
        default: 'nps test.node.all',
        all: {
          script: 'nps ' +
            'test.node.bdd ' +
            'test.node.tdd ' +
            'test.node.qunit ' +
            'test.node.exports ' +
            'test.node.unit ' +
            'test.node.integration ' +
            'test.node.jsapi ' +
            'test.node.compilers ' +
            'test.node.requires ' +
            'test.node.reporters ' +
            'test.node.only ' +
            'test.node.globalOnly',
          description: 'Run all tests for node environment'
        },
        bdd: test('bdd', '--ui bdd test/interfaces/bdd.spec'),
        tdd: test('tdd', '--ui tdd test/interfaces/tdd.spec'),
        qunit: test('qunit', '--ui qunit test/interfaces/qunit.spec'),
        exports: test('exports', '--ui exports test/interfaces/exports.spec'),
        unit: test('unit', 'test/unit/*.spec.js test/node-unit/*.spec.js --growl'),
        integration: test('integration', '--timeout 5000 --slow 500 test/integration/*.spec.js'),
        jsapi: 'node test/jsapi',
        compilers: {
          default: 'nps test.node.compilers.coffee test.node.compilers.custom test.node.compilers.multiple',
          coffee: test('compilers-coffee', '--compilers coffee:coffee-script/register test/compiler'),
          custom: test('compilers-custom', '--compilers foo:./test/compiler-fixtures/foo.fixture test/compiler'),
          multiple: test('compilers-multiple', '--compilers coffee:coffee-script/register,foo:./test/compiler-fixtures/foo.fixture test/compiler')
        },
        requires: test('requires', '--compilers coffee:coffee-script/register ' +
          '--require test/require/a.js ' +
          '--require test/require/b.coffee ' +
          '--require test/require/c.js ' +
          '--require test/require/d.coffee ' +
          'test/require/require.spec.js'),
        reporters: test('reporters', 'test/reporters/*.spec.js'),
        only: {
          default: 'nps test.node.only.bdd test.node.only.tdd test.node.only.bddRequire',
          bdd: test('only-bdd', '--ui bdd test/only/bdd.spec'),
          tdd: test('only-tdd', '--ui tdd test/only/tdd.spec'),
          bddRequire: test('only-bdd-require', '--ui qunit test/only/bdd-require.spec')
        },
        globalOnly: {
          default: 'nps test.node.globalOnly.bdd test.node.globalOnly.tdd test.node.globalOnly.qunit',
          bdd: test('global-only-bdd', '--ui bdd test/only/global/bdd.spec'),
          tdd: test('global-only-tdd', '--ui tdd test/only/global/tdd.spec'),
          qunit: test('global-only-qunit', '--ui qunit test/only/global/qunit.spec')
        }
      },
      browser: {
        default: 'nps ' +
          'clean ' +
          'build.mochajs ' +
          'test.browser.unit ' +
          'test.browser.bdd ' +
          'test.browser.tdd ' +
          'test.browser.qunit ' +
          'test.browser.esm',
        unit: `NODE_PATH=. ${KARMA} start --single-run`,
        bdd: 'MOCHA_TEST=bdd nps test.browser.unit',
        tdd: 'MOCHA_TEST=tdd nps test.browser.unit',
        qunit: 'MOCHA_TEST=qunit nps test.browser.unit',
        esm: 'MOCHA_TEST=esm nps test.browser.unit'
      },
      nonTTY: {
        default: 'nps test.nonTTY.dot test.nonTTY.list test.nonTTY.spec',
        dot: test('non-tty-dot', '--reporter dot test/interfaces/bdd.spec 2>&1 > /tmp/dot.out && echo "dot:" && cat /tmp/dot.out'),
        list: test('non-tty-list', '--reporter list test/interfaces/bdd.spec 2>&1 > /tmp/list.out && echo "list:" && cat /tmp/list.out'),
        spec: test('non-tty-dot', '--reporter spec test/interfaces/bdd.spec 2>&1 > /tmp/spec.out && echo "spec:" && cat /tmp/spec.out')
      }
    },
    tm: `open editors/${TM_BUNDLE}`,
    prepublishOnly: 'nps test clean build',
    coveralls: 'nyc report --reporter=text-lcov | coveralls',
    prebuildDocs: 'rm -rf docs/_dist && node scripts/docs-update-toc.js',
    buildDocs: 'nps prebuildDocs && bundle exec jekyll build --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts && nps postbuildDocs',
    postbuildDocs: 'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js >> docs/_dist/_headers',
    prewatchDocs: 'node scripts/docs-update-toc.js',
    watchDocs: 'nps prewatchDocs && bundle exec jekyll serve --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts --watch',
    withCoverage: 'echo "Code Coverage enabled"'
  }
};
