'use strict';

const {createSandbox} = require('sinon');
const rewiremock = require('rewiremock/node');
const {ONE_AND_DONE_ARGS} = require('../../../lib/cli/one-and-dones');

const modulePath = require.resolve('../../../lib/cli/options');
const mocharcPath = require.resolve('../../../lib/mocharc.json');
const configPath = require.resolve('../../../lib/cli/config');

const proxyLoadOptions = ({
  readFileSync = {},
  findupSync = {},
  findConfig = {},
  loadConfig = {}
} = {}) =>
  rewiremock.proxy(modulePath, r => ({
    fs: r.with({readFileSync}).directChildOnly(),
    [mocharcPath]: defaults,
    'findup-sync': r.by(() => findupSync).directChildOnly(),
    [configPath]: r.with({findConfig, loadConfig}).directChildOnly()
  })).loadOptions;

const defaults = {
  timeout: 1000,
  timeouts: 1000,
  t: 1000,
  opts: '/default/path/to/mocha.opts'
};

describe('options', function() {
  let sandbox;
  let readFileSync;
  let findupSync;
  let loadOptions;
  let findConfig;
  let loadConfig;

  beforeEach(function() {
    sandbox = createSandbox();
    rewiremock.enable();
  });

  afterEach(function() {
    sandbox.restore();
    rewiremock.disable();
  });

  /**
   * Order of priority:
   * 1. Command-line args
   * 2. RC file (`.mocharc.js`, `.mocharc.ya?ml`, `mocharc.json`)
   * 3. `mocha` prop of `package.json`
   * 4. `mocha.opts`
   * 5. default rc
   */
  describe('loadOptions()', function() {
    describe('when no parameter provided', function() {
      beforeEach(function() {
        readFileSync = sandbox.stub();
        readFileSync.onFirstCall().returns('{}');
        readFileSync.onSecondCall().returns('--retries 3');
        findConfig = sandbox.stub().returns('/some/.mocharc.json');
        loadConfig = sandbox.stub().returns({});
        findupSync = sandbox.stub().returns('/some/package.json');

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
            opts: false,
            package: false,
            retries: 3
          })
        );
      });
    });

    describe('when parameter provided', function() {
      describe('mocha.opts', function() {
        describe('when path to mocha.opts (`--opts <path>`) is invalid', function() {
          describe('when path is not default', function() {
            let opts;

            beforeEach(function() {
              opts = '/some/other/path/to/mocha.opts';
              readFileSync = sandbox.stub();
              readFileSync.onFirstCall().returns('{}');
              readFileSync.onSecondCall().throws();
              findConfig = sandbox.stub().returns('/some/.mocharc.json');
              loadConfig = sandbox.stub().returns({});
              findupSync = sandbox.stub().returns('/some/package.json');

              loadOptions = proxyLoadOptions({
                readFileSync,
                findConfig,
                loadConfig,
                findupSync
              });
            });

            it('should attempt to load file at path', function() {
              try {
                loadOptions(`--opts ${opts}`);
              } catch (ignored) {}
              expect(readFileSync, 'was called with', opts, 'utf8');
            });

            it('should throw', function() {
              expect(
                () => {
                  loadOptions(`--opts ${opts}`);
                },
                'to throw',
                /unable to read/i
              );
            });
          });

          describe('when path to mocha.opts is unspecified', function() {
            let result;

            beforeEach(function() {
              readFileSync = sandbox.stub();
              readFileSync.onFirstCall().returns('{}');
              readFileSync.onSecondCall().returns('{}');
              readFileSync.onThirdCall().throws();
              findConfig = sandbox.stub().returns('/some/.mocharc.json');
              loadConfig = sandbox.stub().returns({});
              findupSync = sandbox.stub().returns('/some/package.json');

              loadOptions = proxyLoadOptions({
                readFileSync,
                findConfig,
                loadConfig,
                findupSync
              });

              result = loadOptions();
            });

            it('should attempt to load default mocha.opts', function() {
              expect(readFileSync, 'was called with', defaults.opts, 'utf8');
            });

            it('should set opts = false', function() {
              expect(result, 'to have property', 'opts', false);
            });
          });
        });

        describe('when path to mocha.opts (`--opts <path>`) is valid', function() {
          let result;

          beforeEach(function() {
            const filepath = '/path/to/mocha.opts';
            readFileSync = sandbox.stub();
            // package.json
            readFileSync.onFirstCall().throws();
            // mocha.opts
            readFileSync.onSecondCall().returns('--retries 3');
            findConfig = sandbox.stub().returns('/some/.mocharc.json');
            loadConfig = sandbox.stub().returns({});
            findupSync = sandbox.stub().returns('/some/package.json');
            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });
            result = loadOptions(['--opts', filepath]);
          });

          it('should return merged options incl. mocha.opts', function() {
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
                  opts: false,
                  package: false,
                  retries: 3
                }
              )
            );
          });

          it('should have attempted to load two files', function() {
            expect(readFileSync, 'was called times', 2).and(
              'to have calls satisfying',
              [
                {args: ['/some/package.json', 'utf8']},
                {args: ['/path/to/mocha.opts', 'utf8']}
              ]
            );
          });

          it('should set opts = false', function() {
            expect(result, 'to have property', 'opts', false);
          });
        });

        describe('when called with opts = false (`--no-opts`)', function() {
          let result;
          beforeEach(function() {
            readFileSync = sandbox
              .stub()
              .returns('{"mocha": {"check-leaks": false}}');
            findConfig = sandbox.stub().returns('/some/.mocharc.json');
            loadConfig = sandbox.stub().returns({retries: 3});
            findupSync = sandbox.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });

            result = loadOptions('--no-opts');
          });

          it('should return parsed args, default config, config file, and package.json', function() {
            expect(
              result,
              'to equal',
              Object.assign({_: []}, defaults, {
                'check-leaks': false,
                config: false,
                opts: false,
                package: false,
                retries: 3
              })
            );
          });

          it('should not attempt to read any mocha.opts', function() {
            expect(readFileSync, 'was called times', 1).and(
              'to have all calls satisfying',
              ['/some/package.json', 'utf8']
            );
          });

          it('should set opts = false', function() {
            expect(result, 'to have property', 'opts', false);
          });
        });
      });

      describe('package.json', function() {
        describe('when path to package.json (`--package <path>`) is valid', function() {
          let result;

          beforeEach(function() {
            const filepath = '/some/package.json';
            readFileSync = sandbox.stub();
            // package.json
            readFileSync.onFirstCall().returns('{"mocha": {"retries": 3}}');
            // mocha.opts
            readFileSync.onSecondCall().throws();
            findConfig = sandbox.stub().returns('/some/.mocharc.json');
            loadConfig = sandbox.stub().returns({});
            findupSync = sandbox.stub();
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
                  opts: false,
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
            readFileSync = sandbox.stub();
            // package.json
            readFileSync.onFirstCall().throws('yikes');
            // mocha.opts
            readFileSync.onSecondCall().throws();
            findConfig = sandbox.stub().returns('/some/.mocharc.json');
            loadConfig = sandbox.stub().returns({});
            findupSync = sandbox.stub();
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
            readFileSync = sandbox.stub();
            // package.json
            readFileSync.onFirstCall().returns('{"mocha": {"retries": 3}}');
            // mocha.opts
            readFileSync.onSecondCall().throws();
            findConfig = sandbox.stub().returns('/some/.mocharc.json');
            loadConfig = sandbox.stub().returns({});
            findupSync = sandbox.stub().returns(filepath);
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
                  _: []
                },
                defaults,
                {
                  config: false,
                  opts: false,
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
            readFileSync = sandbox.stub();

            readFileSync.onFirstCall().returns('--retries 3');
            findConfig = sandbox.stub().returns('/some/path/to/.mocharc.json');
            loadConfig = sandbox.stub().returns({'check-leaks': true});
            findupSync = sandbox.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });

            result = loadOptions('--no-package');
          });

          it('should return parsed args, default config, package.json and mocha.opts', function() {
            expect(
              result,
              'to equal',
              Object.assign({_: []}, defaults, {
                'check-leaks': true,
                config: false,
                opts: false,
                package: false,
                retries: 3
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
            readFileSync = sandbox.stub();
            readFileSync
              .onFirstCall()
              .returns('{"mocha": {"check-leaks": true}}');
            readFileSync.onSecondCall().returns('--retries 3');
            findConfig = sandbox.stub();
            loadConfig = sandbox.stub();
            findupSync = sandbox.stub().returns('/some/package.json');

            loadOptions = proxyLoadOptions({
              readFileSync,
              findConfig,
              loadConfig,
              findupSync
            });

            result = loadOptions('--no-config');
          });

          it('should return parsed args, default config, package.json and mocha.opts', function() {
            expect(
              result,
              'to equal',
              Object.assign({_: []}, defaults, {
                'check-leaks': true,
                config: false,
                opts: false,
                package: false,
                retries: 3
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
            readFileSync = sandbox.stub();
            config = '/some/.mocharc.json';
            readFileSync.onFirstCall().returns('--retries 3');
            readFileSync.onSecondCall().returns('{}');
            findConfig = sandbox.stub();
            loadConfig = sandbox.stub().throws('Error', 'failed to parse');
            findupSync = sandbox.stub().returns('/some/package.json');

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
            expect(loadConfig, 'was called with', config);
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
              readFileSync = sandbox.stub();
              readFileSync.onFirstCall().returns('--retries 3');
              readFileSync.onSecondCall().returns('{}');
              findConfig = sandbox.stub().returns('/some/.mocharc.json');
              loadConfig = sandbox.stub().returns({});
              findupSync = sandbox.stub().returns('/some/package.json');

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
              expect(loadConfig, 'was called with', '/some/.mocharc.json');
            });

            it('should set config = false', function() {
              expect(result, 'to have property', 'config', false);
            });
          });

          describe('when an rc file would not be found', function() {
            let result;

            beforeEach(function() {
              readFileSync = sandbox.stub();
              readFileSync.onFirstCall().returns('--retries 3');
              readFileSync.onSecondCall().returns('{}');
              findConfig = sandbox.stub().returns(null);
              loadConfig = sandbox.stub().returns({});
              findupSync = sandbox.stub().returns('/some/package.json');

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
      it('should prioritize mocha.opts over defaults', function() {
        readFileSync = sandbox.stub();
        readFileSync.onFirstCall().returns('{}');
        readFileSync.onSecondCall().returns('--timeout 800 --require foo');
        findConfig = sandbox.stub().returns('/some/.mocharc.json');
        loadConfig = sandbox.stub().returns({});
        findupSync = sandbox.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to satisfy', {timeout: 800, require: ['foo']});
      });

      it('should prioritize package.json over mocha.opts', function() {
        readFileSync = sandbox.stub();
        readFileSync
          .onFirstCall()
          .returns('{"mocha": {"timeout": 700, "require": "bar"}}');
        readFileSync.onSecondCall().returns('--timeout 800 --require foo');
        findConfig = sandbox.stub().returns('/some/.mocharc.json');
        loadConfig = sandbox.stub().returns({});
        findupSync = sandbox.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to satisfy', {
          timeout: 700,
          require: ['bar', 'foo']
        });
      });

      it('should prioritize rc file over package.json', function() {
        readFileSync = sandbox.stub();
        readFileSync.onFirstCall().returns('{"mocha": {"timeout": 700}}');
        readFileSync.onSecondCall().returns('--timeout 800');
        findConfig = sandbox.stub().returns('/some/.mocharc.json');
        loadConfig = sandbox.stub().returns({timeout: 600});
        findupSync = sandbox.stub().returns('/some/package.json');

        loadOptions = proxyLoadOptions({
          readFileSync,
          findConfig,
          loadConfig,
          findupSync
        });

        expect(loadOptions(), 'to have property', 'timeout', 600);
      });

      it('should prioritize args over rc file', function() {
        readFileSync = sandbox.stub();
        readFileSync.onFirstCall().returns('{"mocha": {"timeout": 700}}');
        readFileSync.onSecondCall().returns('--timeout 800');
        findConfig = sandbox.stub().returns('/some/.mocharc.json');
        loadConfig = sandbox.stub().returns({timeout: 600});
        findupSync = sandbox.stub().returns('/some/package.json');

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
          500
        );
      });
    });

    describe('when called with a one-and-done arg', function() {
      beforeEach(function() {
        readFileSync = sandbox.stub();
        findConfig = sandbox.stub();
        loadConfig = sandbox.stub();
        findupSync = sandbox.stub();
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
  });
});
