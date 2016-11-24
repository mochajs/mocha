'use strict';

var path = require('path');
var shell = require('shelljs');
var mochaPath = path.join(__dirname, 'bin', 'mocha');
var bashPath = shell.which('bash');

function mocha () {
  var args = Array.prototype.slice(arguments);
  return [mochaPath].concat(args)
    .join(' ');
}

var scripts = {
  default: {
    description: 'Display available scripts',
    script: 'nps --help'
  },
  build: {},
  lint: {
    script: 'eslint .',
    description: 'Lint Mocha with ESLint'
  },
  test: {
    default: {
      script: 'nps --parallel lint,test.node',
      description: 'Lint & execute all tests (in parallel)'
    },
    node: {
      default: {
        script: 'nps test.node.unit test.node.integration'
      },
      unit: {
        description: 'Execute unit tests (Node.js)',
        script: mocha('test/*.js', 'test/acceptance/*.js')
      },
      integration: {
        default: {
          // TODO: use Object.keys()
          script: 'nps test.node.integration.api test.node.integration.cli ' +
          'test.node.integration.reporters test.node.integration.dynamic-only ' +
          'test.node.integration.static-only test.node.integration.compilers ' +
          'test.node.integration.requires test.node.integration.interfaces ' +
          'test.node.integration.non-tty'
        },
        api: {
          description: 'Execute API tests (Node.js)',
          script: process.execPath + ' test/jsapi/'
        },
        cli: {
          description: 'Execute CLI tests (Node.js)',
          script: mocha('--timeout 500', 'test/integration/*.js')
        },
        reporters: {
          description: 'Execute reporter tests (Node.js)',
          script: mocha('test/reporters/*.js')
        },
        'dynamic-only': {
          default: {
            script: 'nps t.n.i.do.tdd t.n.i.do.bdd t.n.i.do.qunit'
          },
          tdd: {
            description: 'Execute dynamic "only" tests in TDD interface (Node.js)',
            script: mocha('--ui tdd', 'test/acceptance/misc/only/tdd.spec.js')
          },
          bdd: {
            description: 'Execute dynamic "only" tests in BDD interface (Node.js)',
            script: mocha('--ui bdd', 'test/acceptance/misc/only/bdd.spec.js')
          },
          qunit: {
            description: 'Execute dynamic "only" tests in QUnit interface (Node.js)',
            script: mocha('--ui qunit',
              'test/acceptance/misc/only/qunit.spec.js')
          }
        },
        'static-only': {
          script: 'nps t.n.i.so.tdd t.n.i.so.bdd t.n.i.so.qunit',
          tdd: {
            description: 'Execute static "only" tests in TDD interface (Node.js)',
            script: mocha('--ui tdd',
              'test/acceptance/misc/only/global/tdd.spec.js')
          },
          bdd: {
            description: 'Execute static "only" tests in BDD interface (Node.js)',
            script: mocha('--ui bdd',
              'test/acceptance/misc/only/global/bdd.spec.js')
          },
          qunit: {
            description: 'Execute static "only" tests in QUnit interface (Node.js)',
            script: mocha('--ui qunit',
              'test/acceptance/misc/only/global/qunit.spec.js')
          }
        },
        compilers: {
          description: 'Execute "--compilers" tests (Node.js)',
          script: mocha('--compilers coffee:coffee-script/register,' +
            'foo:./test/compiler/foo', 'test/acceptance/test.coffee',
            'test/acceptance/test.foo')
        },
        requires: {
          description: 'Execute "--require" tests (Node.js)',
          script: mocha('--compilers coffee:coffee-script/register',
            '--require test/acceptance/require/a.js',
            '--require test/acceptance/require/b.coffee',
            '--require test/acceptance/require/c.js',
            '--require test/acceptance/require/d.coffee',
            'test/acceptance/require/require.spec.js')
        },
        interfaces: {
          default: {
            script: 'nps t.n.i.i.bdd t.n.i.i.tdd t.n.i.i.qunit'
          },
          bdd: {
            description: 'Execute "BDD" interface tısts (Node.js)',
            script: mocha('--ui bdd', 'test/acceptance/interfaces/bdd.spec.js')
          },
          tdd: {
            description: 'Execute "TDD" interface tests (Node.js)',
            script: mocha('--ui tdd', 'test/acceptance/interfaces/tdd.spec.js')
          },
          qunit: {
            description: 'Execute "QUnit" interface tests (Node.js)',
            script: mocha('--ui qunit',
              'test/acceptance/interfaces/qunit.spec.js')
          }
        },
        'non-tty': {
          description: 'Execute non-TTY output tests (Node.js)',
          script: mocha('test/non-tty/non-tty.spec.js')
        }
      }
    }
  }
};

if (bashPath) {
  scripts.test.node.glob = {
    description: 'Execute globbing tests (Node.js)',
    script: bashPath + ' test/acceptance/glob/glob.sh'
  };
}

exports.scripts = scripts;
