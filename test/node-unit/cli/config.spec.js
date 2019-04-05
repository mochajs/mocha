'use strict';

const path = require('path');
const {
  resolveConfigPath,
  parseConfig,
  parsers,
  CONFIG_FILES
} = require('../../../lib/cli/config');
const {createSandbox} = require('sinon');
const rewiremock = require('rewiremock/node');

describe('cli/config', function() {
  let sandbox;
  const config = {ok: true};

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('resolveConfigPath', function() {
    let prevCwd;
    const cwd = path.resolve(__dirname, '../../integration/fixtures/config');
    const yamlpath = 'subdir/mocha-config.yaml';
    const absYamlpath = path.join(cwd, yamlpath);
    const modulepath = 'shared-config';
    const absModulepath = path.resolve(
      cwd,
      'node_modules/shared-config/mocha-config.js'
    );

    beforeEach(function() {
      prevCwd = process.cwd();
      process.chdir(cwd);
    });

    afterEach(function() {
      process.chdir(prevCwd);
    });

    describe('when supplied a cwd-relative path', function() {
      it('should return absolute path to file', function() {
        const {absFilepath, discoveryMethod} = resolveConfigPath(yamlpath);
        expect(absFilepath, 'to be', absYamlpath);
        expect(discoveryMethod, 'to be', 'cwd-relative');
      });
    });
    describe('when supplied an absolute path', function() {
      it('should return absolute path to file', function() {
        const {absFilepath, discoveryMethod} = resolveConfigPath(absYamlpath);
        expect(absFilepath, 'to be', absYamlpath);
        expect(discoveryMethod, 'to be', 'cwd-relative');
      });
    });
    describe('when supplied a require-able path', function() {
      it('should return absolute path to file with require-resolve discovery', function() {
        const {absFilepath, discoveryMethod} = resolveConfigPath(modulepath);
        expect(absFilepath, 'to be', absModulepath);
        expect(discoveryMethod, 'to be', 'node-require-resolve');
      });
    });
  });

  describe('parseConfig()', function() {
    describe('when parsing succeeds', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').returns(config);
        sandbox.stub(parsers, 'json').returns(config);
        sandbox.stub(parsers, 'js').returns(config);
      });

      describe('when supplied a filepath with ".yaml" extension', function() {
        const filepath = 'foo.yaml';

        it('should use the YAML parser', function() {
          parseConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with ".yml" extension', function() {
        const filepath = 'foo.yml';

        it('should use the YAML parser', function() {
          parseConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with ".js" extension', function() {
        const filepath = 'foo.js';

        it('should use the JS parser', function() {
          parseConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with ".jsonc" extension', function() {
        const filepath = 'foo.jsonc';

        it('should use the JSON parser', function() {
          parseConfig('foo.jsonc');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with ".json" extension', function() {
        const filepath = 'foo.json';

        it('should use the JSON parser', function() {
          parseConfig('foo.json');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });
    });

    describe('when supplied a filepath with unsupported extension', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').returns(config);
        sandbox.stub(parsers, 'json').returns(config);
        sandbox.stub(parsers, 'js').returns(config);
      });

      it('should assume JSON', function() {
        parseConfig('foo.bar');
        expect(parsers.json, 'was called');
      });
    });

    describe('when config file parsing fails', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').throws();
      });

      it('should throw', function() {
        expect(() => parseConfig('goo.yaml'), 'to throw', /failed to parse/);
      });
    });
  });

  describe('findConfig()', function() {
    let findup;
    let findConfig;

    beforeEach(function() {
      findup = {sync: sandbox.stub().returns('/some/path/.mocharc.js')};
      rewiremock.enable();
      findConfig = rewiremock.proxy(
        require.resolve('../../../lib/cli/config'),
        r => ({
          'find-up': r.by(() => findup)
        })
      ).findConfig;
    });

    afterEach(function() {
      rewiremock.disable();
    });

    it('should look for one of the config files using findup-sync', function() {
      findConfig();
      expect(findup, 'to have a call satisfying', {
        args: [CONFIG_FILES, {cwd: process.cwd()}],
        returned: '/some/path/.mocharc.js'
      });
    });

    it('should support an explicit `cwd`', function() {
      findConfig('/some/path/');
      expect(findup, 'to have a call satisfying', {
        args: [CONFIG_FILES, {cwd: '/some/path/'}],
        returned: '/some/path/.mocharc.js'
      });
    });
  });
});
