'use strict';

const Mocha = require('../../lib/mocha');
const utils = require('../../lib/utils');

describe('Mocha', function() {
  const opts = {reporter: utils.noop}; // no output

  describe('#addFile', function() {
    it('should add the given file to the files array', function() {
      const mocha = new Mocha(opts);
      mocha.addFile('some-file.js');
      expect(mocha.files, 'to have length', 1).and(
        'to contain',
        'some-file.js'
      );
    });

    it('should be chainable', function() {
      const mocha = new Mocha(opts);
      expect(mocha.addFile('some-file.js'), 'to be', mocha);
    });
  });

  describe('#loadFiles', function() {
    it('should load all files from the files array', function() {
      this.timeout(1000);
      const mocha = new Mocha(opts);

      mocha.addFile(require.resolve('../../package.json'));
      mocha.loadFiles();
      expect(require.cache, 'to have keys', [
        require.resolve('../../package.json')
      ]);
    });

    it('should execute the optional callback if given', function() {
      const mocha = new Mocha(opts);
      expect(cb => {
        mocha.loadFiles(cb);
      }, 'to call the callback');
    });
  });

  describe('.unloadFile', function() {
    it('should unload a specific file from cache', function() {
      const resolvedFilePath = require.resolve(__filename);
      require(__filename);
      expect(require.cache, 'to have key', resolvedFilePath);

      Mocha.unloadFile(__filename);
      expect(require.cache, 'not to have key', resolvedFilePath);
    });
  });

  describe('#unloadFiles', function() {
    it('should unload all test files from cache', function() {
      const mocha = new Mocha(opts);
      mocha.addFile(require.resolve('../../package.json'));
      mocha.loadFiles();
      mocha.unloadFiles();
      expect(require.cache, 'not to have keys', [
        require.resolve('../../package.json')
      ]);
    });

    it('should be chainable', function() {
      const mocha = new Mocha(opts);
      expect(mocha.unloadFiles(), 'to be', mocha);
    });
  });
});
