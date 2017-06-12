'use strict';

describe('options', function () {
  describe('#defaultOptionsPath', function () {
    var options = require('../../lib/options');

    it('property should have value \'test/mocha.opts\'', function () {
      expect(options.defaultOptionsPath).to.equal('test/mocha.opts');
    });

    it('property should NOT be writable/configurable', function () {
      expect(function () {
        options.defaultOptionsPath = '/new/path/mocha.opts';
      }).to.throwError(function (error) {
        expect(error).to.be.a(TypeError);
      });
    });
  });

  describe('#path', function () {
    var options = require('../../lib/options');

    it('should return user passed options path if it exists, or the default path', function () {
      var argv, path;

      argv = [];
      path = options.path(argv, options.defaultOptionsPath);
      expect(path).to.equal(options.defaultOptionsPath);

      argv = ['--opts', '/user/passed/mocha.opts'];
      path = options.path(argv, options.defaultOptionsPath);
      expect(path).to.equal('/user/passed/mocha.opts');
    });
  });

  describe('#read', function () {
    var options = require('../../lib/options');

    it('throws when given a path that does not exist', function () {
      // 1. no path is passed
      expect(function () {
        options.read();
      }).to.throwError();

      // 2. non-existing path is passed
      expect(function () {
        options.read('/path/does/not/exist/mocha.opts');
      }).to.throwError();
    });

    // Skipped because it cannot be reliably run in PhantomJS.
    // And because it's skipped, the required `del` module will be uninstalled.
    it.skip('reads the given path when it exists', function () {
      var fs = require('fs');
      var rimraf = require('rimraf');

      var now = Date.now();
      var text = '--opt-1 value-1\n--opt-2 value-2';

      fs.mkdirSync('test-data');
      fs.writeFileSync('test-data/mocha' + now + '.opts', text);
      expect(function () {
        var optsContent = options.read('test-data/mocha' + now + '.opts');
        expect(optsContent).to.equal(text);
      }).to.not.throwError();

      // clean up
      rimraf.sync('test-data/');
    });
  });

  describe('#parse', function () {
    var options = require('../../lib/options');

    it('parse the given option', function () {
      var opts = options.parse('--opts-1 value-1\n--opts-2 value-2');

      expect(opts).eql(['--opts-1', 'value-1', '--opts-2', 'value-2']);
    });

    it('throws when passed an argument that is not a string', function () {
      expect(function () {
        options.parse();
      }).to.throwError();
    });
  });
});
