'use strict';

const sinon = require('sinon');
const rewiremock = require('rewiremock/node');
const {parsers} = require('../../../lib/cli/config');

describe('cli/config', function () {
  const phonyConfigObject = {ok: true};

  afterEach(function () {
    sinon.restore();
  });

  describe('loadConfig()', function () {
    let parsers;
    let loadConfig;

    beforeEach(function () {
      const config = rewiremock.proxy(
        require.resolve('../../../lib/cli/config')
      );
      parsers = config.parsers;
      loadConfig = config.loadConfig;
    });

    describe('when parsing succeeds', function () {
      beforeEach(function () {
        sinon.stub(parsers, 'yaml').returns(phonyConfigObject);
        sinon.stub(parsers, 'json').returns(phonyConfigObject);
        sinon.stub(parsers, 'js').returns(phonyConfigObject);
      });

      describe('when supplied a filepath with ".yaml" extension', function () {
        const filepath = 'foo.yaml';

        it('should use the YAML parser', function () {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".yml" extension', function () {
        const filepath = 'foo.yml';

        it('should use the YAML parser', function () {
          loadConfig(filepath);
          expect(parsers.yaml, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".js" extension', function () {
        const filepath = 'foo.js';

        it('should use the JS parser', function () {
          loadConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".cjs" extension', function () {
        const filepath = 'foo.cjs';

        it('should use the JS parser', function () {
          loadConfig(filepath);
          expect(parsers.js, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".jsonc" extension', function () {
        const filepath = 'foo.jsonc';

        it('should use the JSON parser', function () {
          loadConfig('foo.jsonc');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });

      describe('when supplied a filepath with ".json" extension', function () {
        const filepath = 'foo.json';

        it('should use the JSON parser', function () {
          loadConfig('foo.json');
          expect(parsers.json, 'to have calls satisfying', [
            {args: [filepath], returned: phonyConfigObject}
          ]).and('was called once');
        });
      });
    });

    describe('when supplied a filepath with unsupported extension', function () {
      beforeEach(function () {
        sinon.stub(parsers, 'json').returns(phonyConfigObject);
      });

      it('should use the JSON parser', function () {
        loadConfig('foo.bar');
        expect(parsers.json, 'was called');
      });
    });

    describe('when config file parsing fails', function () {
      beforeEach(function () {
        sinon.stub(parsers, 'yaml').throws('goo.yaml is unparsable');
      });

      it('should throw', function () {
        expect(
          () => loadConfig('goo.yaml'),
          'to throw',
          'Unable to read/parse goo.yaml: goo.yaml is unparsable'
        );
      });
    });
  });

  describe('findConfig()', function () {
    let findup;
    let findConfig;
    let CONFIG_FILES;

    beforeEach(function () {
      findup = {sync: sinon.stub().returns('/some/path/.mocharc.js')};
      const config = rewiremock.proxy(
        require.resolve('../../../lib/cli/config'),
        r => ({
          'find-up': r.by(() => findup)
        })
      );
      findConfig = config.findConfig;
      CONFIG_FILES = config.CONFIG_FILES;
    });

    it('should look for one of the config files using findup-sync', function () {
      findConfig();
      expect(findup, 'to have a call satisfying', {
        args: [CONFIG_FILES, {cwd: process.cwd()}],
        returned: '/some/path/.mocharc.js'
      });
    });

    it('should support an explicit `cwd`', function () {
      findConfig('/some/path/');
      expect(findup, 'to have a call satisfying', {
        args: [CONFIG_FILES, {cwd: '/some/path/'}],
        returned: '/some/path/.mocharc.js'
      });
    });
  });

  describe('parsers()', function () {
    it('should print error message for faulty require', function () {
      // Fixture exists, but fails loading.
      // Prints correct error message without using fallback path.
      expect(
        () => parsers.js(require.resolve('./fixtures/bad-require.fixture.js')),
        'to throw',
        {message: /Cannot find module 'fake'/, code: 'MODULE_NOT_FOUND'}
      );
    });

    it('should print error message for non-existing file', function () {
      expect(() => parsers.js('not-existing.js'), 'to throw', {
        message: /Cannot find module 'not-existing.js'/,
        code: 'MODULE_NOT_FOUND'
      });
    });
  });
});
