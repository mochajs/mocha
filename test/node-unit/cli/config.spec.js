'use strict';

const {loadConfig, parsers, CONFIG_FILES} = require('../../../lib/cli/config');
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

  describe('loadConfig()', function() {
    describe('when parsing succeeds', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').returns(config);
        sandbox.stub(parsers, 'json').returns(config);
        sandbox.stub(parsers, 'js').returns(config);
      });

      describe('when supplied a filepath with .yaml extension', function() {
        const filepath = 'foo.yaml';

        it('should use the YAML parser', function() {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with .yml extension', function() {
        const filepath = 'foo.yml';

        it('should use the YAML parser', function() {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with .js extension', function() {
        const filepath = 'foo.js';

        it('should use the JS parser', function() {
          loadConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: config}
          ]).and('was called times', 1);
        });
      });

      describe('when supplied a filepath with .json extension', function() {
        const filepath = 'foo.json';

        it('should use the JSON parser', function() {
          loadConfig('foo.json');
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
        loadConfig('foo.bar');
        expect(parsers.json, 'was called');
      });
    });

    describe('when config file parsing fails', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').throws();
      });

      it('should throw', function() {
        expect(() => loadConfig('goo.yaml'), 'to throw', /failed to parse/);
      });
    });
  });

  describe('findConfig()', function() {
    let findup;
    let findConfig;

    beforeEach(function() {
      findup = sandbox.stub().returns('/some/path/.mocharc.js');
      rewiremock.enable();
      findConfig = rewiremock.proxy(
        require.resolve('../../../lib/cli/config'),
        r => ({
          'findup-sync': r.by(() => findup)
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
