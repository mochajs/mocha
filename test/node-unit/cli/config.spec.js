'use strict';

const {createSandbox} = require('sinon');
const rewiremock = require('rewiremock/node');

describe('cli/config', function() {
  let sandbox;
  const phonyConfigObject = {ok: true};

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('loadConfig()', function() {
    let parsers;
    let loadConfig;

    beforeEach(function() {
      const config = rewiremock.proxy(
        require.resolve('../../../lib/cli/config')
      );
      parsers = config.parsers;
      loadConfig = config.loadConfig;
    });

    describe('when parsing succeeds', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'yaml').returns(phonyConfigObject);
        sandbox.stub(parsers, 'json').returns(phonyConfigObject);
        sandbox.stub(parsers, 'js').returns(phonyConfigObject);
      });

      describe('when supplied a filepath with ".yaml" extension', function() {
        const filepath = 'foo.yaml';

        it('should use the YAML parser', function() {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".yml" extension', function() {
        const filepath = 'foo.yml';

        it('should use the YAML parser', function() {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".js" extension', function() {
        const filepath = 'foo.js';

        it('should use the JS parser', function() {
          loadConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".cjs" extension', function() {
        const filepath = 'foo.cjs';

        it('should use the JS parser', function() {
          loadConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".jsonc" extension', function() {
        const filepath = 'foo.jsonc';

        it('should use the JSON parser', function() {
          loadConfig('foo.jsonc');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".json" extension', function() {
        const filepath = 'foo.json';

        it('should use the JSON parser', function() {
          loadConfig('foo.json');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });
    });

    describe('when supplied a filepath with unsupported extension', function() {
      beforeEach(function() {
        sandbox.stub(parsers, 'json').returns(phonyConfigObject);
      });

      it('should use the JSON parser', function() {
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
    let CONFIG_FILES;

    beforeEach(function() {
      findup = {sync: sandbox.stub().returns('/some/path/.mocharc.js')};
      const config = rewiremock.proxy(
        require.resolve('../../../lib/cli/config'),
        r => ({
          'find-up': r.by(() => findup)
        })
      );
      findConfig = config.findConfig;
      CONFIG_FILES = config.CONFIG_FILES;
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
