'use strict';

const path = require('path');
const Mocha = require('../../lib/mocha');
const utils = require('../../lib/utils');

describe('Mocha', function() {
  const opts = {reporter: utils.noop}; // no output

  describe('.unloadFile()', function() {
    it('should unload a specific file from cache', function() {
      const resolvedFilePath = require.resolve(__filename);

      require(__filename);
      expect(require.cache, 'to have key', resolvedFilePath);

      Mocha.unloadFile(__filename);
      expect(require.cache, 'not to have key', resolvedFilePath);
    });
  });

  describe('.unloadFiles()', function() {
    it('should unload all test files from cache', function() {
      const mocha = new Mocha(opts);
      let resolvedTestFiles;
      const testFiles = [
        __filename,
        path.join(__dirname, 'cli', 'config.spec.js'),
        path.join(__dirname, 'cli', 'run.spec.js')
      ];

      testFiles.forEach(mocha.addFile, mocha);
      mocha.loadFiles();
      resolvedTestFiles = testFiles.map(require.resolve);
      expect(require.cache, 'to have keys', resolvedTestFiles);

      mocha.unloadFiles();
      expect(require.cache, 'not to have keys', resolvedTestFiles);
    });
  });
});
