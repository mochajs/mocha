'use strict';

const path = require('path');
const Mocha = require('../../lib/mocha');
const utils = require('../../lib/utils');

describe('Mocha', function() {
  const opts = {reporter: utils.noop}; // no output
  const testFiles = [
    __filename,
    path.join(__dirname, 'cli', 'config.spec.js'),
    path.join(__dirname, 'cli', 'run.spec.js')
  ];
  const resolvedTestFiles = testFiles.map(require.resolve);

  describe('#addFile', function() {
    it('should add the given file to the files array', function() {
      const mocha = new Mocha(opts);
      mocha.addFile(__filename);
      expect(mocha.files, 'to have length', 1).and('to contain', __filename);
    });

    it('should be chainable', function() {
      const mocha = new Mocha(opts);
      expect(mocha.addFile(__filename), 'to be', mocha);
    });
  });

  describe('#loadFiles', function() {
    it('should load all files from the files array', function() {
      const mocha = new Mocha(opts);

      testFiles.forEach(mocha.addFile, mocha);
      mocha.loadFiles();
      expect(require.cache, 'to have keys', resolvedTestFiles);
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

      testFiles.forEach(mocha.addFile, mocha);
      mocha.loadFiles();
      mocha.unloadFiles();
      expect(require.cache, 'not to have keys', resolvedTestFiles);
    });

    it('should be chainable', function() {
      const mocha = new Mocha(opts);
      expect(mocha.unloadFiles(), 'to be', mocha);
    });
  });
});
