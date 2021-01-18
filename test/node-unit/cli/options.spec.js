'use strict';

const sinon = require('sinon');
const rewiremock = require('rewiremock/node');
const {ONE_AND_DONE_ARGS} = require('../../../lib/cli/one-and-dones');

const modulePath = require.resolve('../../../lib/cli/options');
const mocharcPath = require.resolve('../../../lib/mocharc.json');
const configPath = require.resolve('../../../lib/cli/config');

const proxyLoadOptions = ({
  readFileSync = {},
  findupSync = null,
  findConfig = {},
  loadConfig = {}
} = {}) =>
  rewiremock.proxy(modulePath, r => ({
    fs: r.with({readFileSync}).directChildOnly(),
    [mocharcPath]: defaults,
    'find-up': r
      .by(() => (findupSync ? {sync: findupSync} : {}))
      .directChildOnly(),
    [configPath]: r.with({findConfig, loadConfig}).directChildOnly()
  })).loadOptions;

const defaults = {
  timeout: 1000,
  extension: ['js']
};

describe('options', function() {
  let readFileSync;
  let findupSync;
  let loadOptions;
  let findConfig;
  let loadConfig;

  afterEach(function() {
    sinon.restore();
  });

  /**
   * Order of priority:
   * 1. Command-line args
   * 2. RC file (`.mocharc.js`, `.mocharc.ya?ml`, `mocharc.json`)
   * 3. `mocha` prop of `package.json`
   * 4. default rc
   */
  describe('loadOptions()', function() {
    describe('when no parameter provided', function() {
      beforeEach(function() {
        this.timeout(1000);
        readFileSync = sinon.stub();
        readFileSync.onFirstCall().returns('{}');
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({});
        findupSync = sinon.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });
      });

      it('should return an object containing positional args, defaults, and anti-reloading flags', function() {
        expect(
          loadOptions(),
          'to equal',
          Object.assign({}, defaults, {
            _: [],
            config: false,
            package: false
          })
        );
      });
    });

    describe('when parameter provided', function() {
      describe('package.json', function() {
        describe('when path to package.json (`--package <path>`) is valid', function() {
          let result;

          beforeEach(function() {
            const filepath = '/some/package.json';
            readFileSync = sinon.stub();
            // package.json
            readFileSync.onFirstCall().returns('{"mocha": {"retries": 3}}');
            findConfig = sinon.stub().returns('/some/.mocharc.json');
            loadConfig = sinon.stub().returns({});
            findupSync = sinon.stub();
            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
            result = loadOptions(['--package', filepath]);
          });

          it('should return merged options incl. package.json opts', function() {
            expect(
              result,
              'to equal',
              Object.assign(
                {
                  _: []
                },
                defaults,
                {
                  config: false,
                  package: false,
                  retries: 3
                }
              )
            );
          });

          it('should not try to find a package.json', function() {
            expect(findupSync, 'was not called');
          });

          it('should set package = false', function() {
            expect(result, 'to have property', 'package', false);
          });
        });

        describe('when path to package.json (`--package <path>`) is invalid', function() {
          beforeEach(function() {
            readFileSync = sinon.stub();
            // package.json
            readFileSync.onFirstCall().throws('yikes');
            findConfig = sinon.stub().returns('/some/.mocharc.json');
            loadConfig = sinon.stub().returns({});
            findupSync = sinon.stub();
            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
          });

          it('should throw', function() {
            expect(
              () => {
                loadOptions('--package /something/wherever --require butts');
              },
              'to throw',
              /unable to read\/parse/i
            );
          });
        });

        describe('when path to package.json unspecified', function() {
          let result;

          beforeEach(function() {
            const filepath = '/some/package.json';
            readFileSync = sinon.stub();
            // package.json
            readFileSync
              .onFirstCall()
              .returns('{"mocha": {"retries": 3, "_": ["foobar.spec.js"]}}');
            findConfig = sinon.stub().returns('/some/.mocharc.json');
            loadConfig = sinon.stub().returns({});
            findupSync = sinon.stub().returns(filepath);
            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
            result = loadOptions();
          });

          it('should return merged options incl. found package.json', function() {
            expect(
              result,
              'to equal',
              Object.assign(
                {
                  _: ['foobar.spec.js']
                },
                defaults,
                {
                  config: false,
                  package: false,
                  retries: 3
                }
              )
            );
          });

          it('should set package = false', function() {
            expect(result, 'to have property', 'package', false);
          });
        });

        describe('when called with package = false (`--no-package`)', function() {
          let result;
          beforeEach(function() {
            readFileSync = sinon.stub();
            readFileSync.onFirstCall().returns('{}');
            findConfig = sinon.stub().returns('/some/path/to/.mocharc.json');
            loadConfig = sinon.stub().returns({'check-leaks': true});
            findupSync = sinon.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });

            result = loadOptions('--no-diff --no-package');
          });

          it('should return parsed args and default config', function() {
            expect(
              result,
              'to equal',
              Object.assign({_: []}, defaults, {
                diff: false,
                'check-leaks': true,
                config: false,
                package: false
              })
            );
          });

          it('should not look for package.json', function() {
            expect(findupSync, 'was not called');
          });

          it('should set package = false', function() {
            expect(result, 'to have property', 'package', false);
          });
        });
      });

      describe('rc file', function() {
        describe('when called with config = false (`--no-config`)', function() {
          let result;
          beforeEach(function() {
            readFileSync = sinon.stub();
            readFileSync
              .onFirstCall()
              .returns(
                '{"mocha": {"check-leaks": true, "_": ["foobar.spec.js"]}}'
              );
            findConfig = sinon.stub();
            loadConfig = sinon.stub();
            findupSync = sinon.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });

            result = loadOptions('--no-diff --no-config');
          });

          it('should return parsed args, default config and package.json', function() {
            expect(
              result,
              'to equal',
              Object.assign({_: ['foobar.spec.js']}, defaults, {
                diff: false,
                'check-leaks': true,
                config: false,
                package: false
              })
            );
          });

          it('should not attempt to load a config file', function() {
            expect(loadConfig, 'was not called');
          });

          it('should not attempt to find a config file', function() {
            expect(findConfig, 'was not called');
          });

          it('should set config = false', function() {
            expect(loadOptions(), 'to have property', 'config', false);
          });
        });

        describe('when path to config (`--config <path>`) is invalid', function() {
          let config;

          beforeEach(function() {
            readFileSync = sinon.stub();
            config = '/some/.mocharc.json';
            readFileSync.onFirstCall().returns('{}');
            findConfig = sinon.stub();
            loadConfig = sinon.stub().throws('Error', 'failed to parse');
            findupSync = sinon.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
          });

          it('should not look for a config', function() {
            try {
              loadOptions(`--config ${config}`);
            } catch (ignored) {}
            expect(findConfig, 'was not called');
          });

          it('should attempt to load file at path', function() {
            try {
              loadOptions(`--config ${config}`);
            } catch (ignored) {}
            expect(loadConfig, 'to have a call satisfying', [config]);
          });

          it('should throw to warn the user', function() {
            expect(
              () => {
                loadOptions(`--config ${config}`);
              },
              'to throw',
              'failed to parse'
            );
          });
        });

        describe('when called with unspecified config', function() {
          describe('when an rc file would be found', function() {
            let result;

            beforeEach(function() {
              readFileSync = sinon.stub();
              readFileSync.onFirstCall().returns('{}');
              readFileSync.onSecondCall().throws();
              findConfig = sinon.stub().returns('/some/.mocharc.json');
              loadConfig = sinon.stub().returns({});
              findupSync = sinon.stub().returns('/some/package.json');

              loadOptions = proxyLoadOptions({
                readFileSync,
                findConfig,
                loadConfig,
                findupSync
              });

              result = loadOptions();
            });

            it('should look for a config', function() {
              expect(findConfig, 'was called');
            });

            it('should attempt to load file at found path', function() {
              expect(loadConfig, 'to have a call satisfying', [
                '/some/.mocharc.json'
              ]);
            });

            it('should set config = false', function() {
              expect(result, 'to have property', 'config', false);
            });
          });

          describe('when an rc file would not be found', function() {
            let result;

            beforeEach(function() {
              readFileSync = sinon.stub();
              readFileSync.onFirstCall().returns('{}');
              readFileSync.onSecondCall().throws();
              findConfig = sinon.stub().returns(null);
              loadConfig = sinon.stub().returns({});
              findupSync = sinon.stub().returns('/some/package.json');

              loadOptions = proxyLoadOptions({
                readFileSync,
                findConfig,
                loadConfig,
                findupSync
              });

              result = loadOptions();
            });

            it('should look for a config', function() {
              expect(findConfig, 'was called');
            });

            it('should not attempt to load a config file', function() {
              expect(loadConfig, 'was not called');
            });

            it('should set config = false', function() {
              expect(result, 'to have property', 'config', false);
            });
          });
        });
      });
    });

    describe('config priority', function() {
      it('should prioritize package.json over defaults', function() {
        readFileSync = sinon.stub();
        readFileSync
          .onFirstCall()
          .returns(
            '{"mocha": {"timeout": 700, "require": "bar", "extension": "ts"}}'
          );
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({});
        findupSync = sinon.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to satisfy', {
          timeout: 700,
          require: ['bar'],
          extension: ['ts']
        });
      });

      it('should prioritize rc file over package.json', function() {
        readFileSync = sinon.stub();
        readFileSync.onFirstCall().returns('{"mocha": {"timeout": 700}}');
        readFileSync.onSecondCall().returns('--timeout 800');
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({timeout: 600});
        findupSync = sinon.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to have property', 'timeout', 600);
      });

      it('should prioritize args over rc file', function() {
        readFileSync = sinon.stub();
        readFileSync.onFirstCall().returns('{"mocha": {"timeout": 700}}');
        readFileSync.onSecondCall().returns('--timeout 800');
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({timeout: 600});
        findupSync = sinon.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(
          loadOptions('--timeout 500'),
          'to have property',
          'timeout',
          '500'
        );
      });
    });

    describe('when called with a one-and-done arg', function() {
      beforeEach(function() {
        readFileSync = sinon.stub();
        findConfig = sinon.stub();
        loadConfig = sinon.stub();
        findupSync = sinon.stub();
        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });
      });

      ONE_AND_DONE_ARGS.forEach(arg => {
        describe(`"${arg}"`, function() {
          it(`should return basic parsed arguments and flag`, function() {
            expect(loadOptions(`--${arg}`), 'to equal', {_: [], [arg]: true});
          });
        });
      });
    });

    describe('"extension" handling', function() {
      describe('when user supplies "extension" option', function() {
        let result;

        beforeEach(function() {
          readFileSync = sinon.stub();
          readFileSync.onFirstCall().throws();
          findConfig = sinon.stub().returns('/some/.mocharc.json');
          loadConfig = sinon.stub().returns({extension: ['tsx']});
          findupSync = sinon.stub();
          loadOptions = proxyLoadOptions({
            readFileSync,
            findConfig,
            loadConfig,
            findupSync
          });
          result = loadOptions(['--extension', 'ts']);
        });

        it('should not concatenate the default value', function() {
          expect(result, 'to have property', 'extension', ['ts', 'tsx']);
        });
      });

      describe('when user does not supply "extension" option', function() {
        let result;

        beforeEach(function() {
          readFileSync = sinon.stub();
          readFileSync.onFirstCall().throws();
          findConfig = sinon.stub().returns('/some/.mocharc.json');
          loadConfig = sinon.stub().returns({});
          findupSync = sinon.stub();
          loadOptions = proxyLoadOptions({
            readFileSync,
            findConfig,
            loadConfig,
            findupSync
          });
          result = loadOptions();
        });

        it('should retain the default', function() {
          expect(result, 'to have property', 'extension', ['js']);
        });
      });
    });

    describe('"spec" handling', function() {
      describe('when user supplies "spec" in config and positional arguments', function() {
        let result;

        beforeEach(function() {
          readFileSync = sinon.stub();
          readFileSync.onFirstCall().throws();
          findConfig = sinon.stub().returns('/some/.mocharc.json');
          loadConfig = sinon.stub().returns({spec: '{dirA,dirB}/**/*.spec.js'});
          findupSync = sinon.stub();
          loadOptions = proxyLoadOptions({
            readFileSync,
            findConfig,
            loadConfig,
            findupSync
          });
          result = loadOptions(['*.test.js']);
        });

        it('should place both - unsplitted - into the positional arguments array', function() {
          expect(result, 'to have property', '_', [
            '*.test.js',
            '{dirA,dirB}/**/*.spec.js'
          ]);
        });
      });
    });

    describe('"ignore" handling', function() {
      let result;

      beforeEach(function() {
        readFileSync = sinon.stub();
        readFileSync.onFirstCall().throws();
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({ignore: '{dirA,dirB}/**/*.spec.js'});
        findupSync = sinon.stub();
        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });
        result = loadOptions(['--ignore', '*.test.js']);
      });

      it('should not split option values by comma', function() {
        expect(result, 'to have property', 'ignore', [
          '*.test.js',
          '{dirA,dirB}/**/*.spec.js'
        ]);
      });
    });
  });
});
