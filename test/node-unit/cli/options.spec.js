'use strict';

const sinon = require('sinon');
const rewiremock = require('rewiremock/node');
const {ONE_AND_DONE_ARGS} = require('../../../lib/cli/one-and-dones');
const {constants} = require('../../../lib/errors');

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

describe('options', function () {
  let readFileSync;
  let findupSync;
  let loadOptions;
  let findConfig;
  let loadConfig;

  afterEach(function () {
    sinon.restore();
  });

  /**
   * Order of priority:
   * 1. Command-line args
   * 2. `MOCHA_OPTIONS` environment variable
   * 3. RC file (`.mocharc.js`, `.mocharc.ya?ml`, `mocharc.json`)
   * 4. `mocha` prop of `package.json`
   * 5. default rc
   */
  describe('loadOptions()', function () {
    describe('when no parameter provided', function () {
      beforeEach(function () {
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

      it('should return an object containing positional args, defaults, and anti-reloading flags', function () {
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

    describe('when parameter provided', function () {
      describe('package.json', function () {
        describe('when path to package.json (`--package <path>`) is valid', function () {
          let result;

          beforeEach(function () {
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

          it('should return merged options incl. package.json opts', function () {
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

          it('should not try to find a package.json', function () {
            expect(findupSync, 'was not called');
          });

          it('should set package = false', function () {
            expect(result, 'to have property', 'package', false);
          });
        });

        describe('when path to package.json (`--package <path>`) is invalid', function () {
          beforeEach(function () {
            readFileSync = sinon.stub();
            // package.json
            readFileSync.onFirstCall().throws('bad file message');
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

          it('should throw', function () {
            expect(
              () => {
                loadOptions('--package /something/wherever --require butts');
              },
              'to throw',
              'Unable to read /something/wherever: bad file message'
            );
          });
        });

        describe('when path to package.json unspecified', function () {
          let result;

          beforeEach(function () {
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

          it('should return merged options incl. found package.json', function () {
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

          it('should set package = false', function () {
            expect(result, 'to have property', 'package', false);
          });
        });

        describe('when path to package.json unspecified and package.json exists but is invalid', function () {
          beforeEach(function () {
            const filepath = '/some/package.json';
            readFileSync = sinon.stub();
            // package.json
            readFileSync
              .onFirstCall()
              .returns('{definitely-invalid');
            findConfig = sinon.stub().returns('/some/.mocharc.json');
            loadConfig = sinon.stub().returns({});
            findupSync = sinon.stub().returns(filepath);
            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
          });

          it('should throw', function () {
            expect(
              () => {
                loadOptions();
              },
              'to throw',
                /SyntaxError/,
            );
          });
        });

        describe('when called with package = false (`--no-package`)', function () {
          let result;
          beforeEach(function () {
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

          it('should return parsed args and default config', function () {
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

          it('should not look for package.json', function () {
            expect(findupSync, 'was not called');
          });

          it('should set package = false', function () {
            expect(result, 'to have property', 'package', false);
          });
        });
      });

      describe('rc file', function () {
        describe('when called with config = false (`--no-config`)', function () {
          let result;
          beforeEach(function () {
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

          it('should return parsed args, default config and package.json', function () {
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

          it('should not attempt to load a config file', function () {
            expect(loadConfig, 'was not called');
          });

          it('should not attempt to find a config file', function () {
            expect(findConfig, 'was not called');
          });

          it('should set config = false', function () {
            expect(result, 'to have property', 'config', false);
          });
        });

        describe('when path to config (`--config <path>`) is invalid', function () {
          let config;

          beforeEach(function () {
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

          it('should not look for a config', function () {
            try {
              loadOptions(`--config ${config}`);
            } catch {}
            expect(findConfig, 'was not called');
          });

          it('should attempt to load file at path', function () {
            try {
              loadOptions(`--config ${config}`);
            } catch {}
            expect(loadConfig, 'to have a call satisfying', [config]);
          });

          it('should throw to warn the user', function () {
            expect(
              () => {
                loadOptions(`--config ${config}`);
              },
              'to throw',
              'failed to parse'
            );
          });
        });

        describe('when called with unspecified config', function () {
          describe('when an rc file would be found', function () {
            let result;

            beforeEach(function () {
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

            it('should look for a config', function () {
              expect(findConfig, 'was called');
            });

            it('should attempt to load file at found path', function () {
              expect(loadConfig, 'to have a call satisfying', [
                '/some/.mocharc.json'
              ]);
            });

            it('should set config = false', function () {
              expect(result, 'to have property', 'config', false);
            });
          });

          describe('when an rc file would not be found', function () {
            let result;

            beforeEach(function () {
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

            it('should look for a config', function () {
              expect(findConfig, 'was called');
            });

            it('should not attempt to load a config file', function () {
              expect(loadConfig, 'was not called');
            });

            it('should set config = false', function () {
              expect(result, 'to have property', 'config', false);
            });
          });
        });
      });
    });

    describe('env options', function () {
      it('should parse flags from MOCHA_OPTIONS', function () {
        readFileSync = sinon.stub().onFirstCall().returns('{}');
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({});
        findupSync = sinon.stub().returns('/some/package.json');
        sinon
          .stub(process, 'env')
          .value({MOCHA_OPTIONS: '--retries 42 --color'});

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to satisfy', {
          retries: 42,
          color: true
        });
      });
    });

    describe('config priority', function () {
      it('should prioritize package.json over defaults', function () {
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

      it('should prioritize rc file over package.json', function () {
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

      it('should prioritize args over rc file', function () {
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

      it('should prioritize env over rc file', function () {
        readFileSync = sinon.stub();
        readFileSync.onFirstCall().returns('{}');
        readFileSync.onSecondCall().returns('');
        findConfig = sinon.stub().returns('/some/.mocharc.json');
        loadConfig = sinon.stub().returns({retries: 300});
        findupSync = sinon.stub().returns('/some/package.json');
        sinon
          .stub(process, 'env')
          .value({MOCHA_OPTIONS: '--retries 800 --color'});

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to have property', 'retries', 800);
      });
    });

    describe('when called with a one-and-done arg', function () {
      beforeEach(function () {
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
        describe(`"${arg}"`, function () {
          it(`should return basic parsed arguments and flag`, function () {
            expect(loadOptions(`--${arg}`), 'to equal', {_: [], [arg]: true});
          });
        });
      });
    });

    describe('"extension" handling', function () {
      describe('when user supplies "extension" option', function () {
        let result;

        beforeEach(function () {
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

        it('should not concatenate the default value', function () {
          expect(result, 'to have property', 'extension', ['ts', 'tsx']);
        });
      });

      describe('when user does not supply "extension" option', function () {
        let result;

        beforeEach(function () {
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

        it('should retain the default', function () {
          expect(result, 'to have property', 'extension', ['js']);
        });
      });
    });

    describe('"spec" handling', function () {
      describe('when user supplies "spec" in config and positional arguments', function () {
        let result;

        beforeEach(function () {
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

        it('should place both - unsplitted - into the positional arguments array', function () {
          expect(result, 'to have property', '_', [
            '*.test.js',
            '{dirA,dirB}/**/*.spec.js'
          ]);
        });
      });
    });

    describe('"ignore" handling', function () {
      let result;

      beforeEach(function () {
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

      it('should not split option values by comma', function () {
        expect(result, 'to have property', 'ignore', [
          '*.test.js',
          '{dirA,dirB}/**/*.spec.js'
        ]);
      });
    });

    describe('"numeric arguments"', function () {
      const numericArg = 123;

      const unsupportedError = arg => {
        return {
          message: `Option ${arg} is unsupported by the mocha cli`,
          code: constants.UNSUPPORTED
        };
      };

      const invalidArgError = (flag, arg, expectedType = 'string') => {
        return {
          message: `Mocha flag '${flag}' given invalid option: '${arg}'`,
          code: constants.INVALID_ARG_TYPE,
          argument: arg,
          actual: 'number',
          expected: expectedType
        };
      };

      beforeEach(function () {
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

      it('throws UNSUPPORTED error when numeric option is passed to cli', function () {
        expect(
          () => loadOptions(`${numericArg}`),
          'to throw',
          unsupportedError(numericArg)
        );
      });

      it('throws INVALID_ARG_TYPE error when numeric argument is passed to mocha flag that does not accept numeric value', function () {
        const flag = '--delay';
        expect(
          () => loadOptions(`${flag} ${numericArg}`),
          'to throw',
          invalidArgError(flag, numericArg, 'boolean')
        );
      });

      it('throws INVALID_ARG_TYPE error when incompatible flag does not have preceding "--"', function () {
        const flag = 'delay';
        expect(
          () => loadOptions(`${flag} ${numericArg}`),
          'to throw',
          invalidArgError(flag, numericArg, 'boolean')
        );
      });

      it('shows correct flag in error when multiple mocha flags have numeric values', function () {
        const flag = '--delay';
        expect(
          () =>
            loadOptions(
              `--timeout ${numericArg} ${flag} ${numericArg} --retries ${numericArg}`
            ),
          'to throw',
          invalidArgError(flag, numericArg, 'boolean')
        );
      });

      it('throws UNSUPPORTED error when numeric arg is passed to unsupported flag', function () {
        const invalidFlag = 'foo';
        expect(
          () => loadOptions(`${invalidFlag} ${numericArg}`),
          'to throw',
          unsupportedError(numericArg)
        );
      });

      it('does not throw error if numeric value is passed to a compatible mocha flag', function () {
        expect(() => loadOptions(`--retries ${numericArg}`), 'not to throw');
      });

      it('does not throw error if numeric value is passed to a node options', function () {
        expect(
          () =>
            loadOptions(
              `--secure-heap-min=${numericArg} --conditions=${numericArg}`
            ),
          'not to throw'
        );
      });

      it('does not throw error if numeric value is passed to string flag', function () {
        expect(() => loadOptions(`--grep ${numericArg}`), 'not to throw');
      });

      it('does not throw error if numeric value is passed to an array flag', function () {
        expect(() => loadOptions(`--spec ${numericArg}`), 'not to throw');
      });
    });
  });
});
