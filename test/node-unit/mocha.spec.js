'use strict';

var Mocha = require('../../lib/mocha');
var Path = require('path');

describe('.unloadFile()', function() {
  it('should unload a specific file from cache', function() {
    var mocha = new Mocha({});
    var resolvedFilePath;
    var filePath = __filename;

    mocha.addFile(filePath);
    mocha.loadFiles();
    resolvedFilePath = require.resolve(filePath);
    expect(require.cache, 'to have key', resolvedFilePath);

    mocha.unloadFile(filePath);
    expect(require.cache, 'not to have key', resolvedFilePath);
  });
});

describe('.unloadFiles()', function() {
  it('should unload all test files from cache', function() {
    var mocha = new Mocha({});
    var resolvedTestFiles;
    var testFiles = [
      __filename,
      Path.join(__dirname, 'fs.spec.js'),
      Path.join(__dirname, 'color.spec.js')
    ];

    testFiles.forEach(mocha.addFile, mocha);
    mocha.loadFiles();
    resolvedTestFiles = testFiles.map(require.resolve);
    expect(require.cache, 'to have keys', resolvedTestFiles);

    mocha.unloadFiles();
    expect(require.cache, 'not to have keys', resolvedTestFiles);
  });
});
