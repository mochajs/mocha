'use strict';

var Mocha = require('../../lib/mocha');
var Path = require('path');

describe('.unloadFile()', function() {
  it('should load and unload file to/from cache', function() {
    var mocha = new Mocha({});
    var filePath = __filename;

    mocha.addFile(filePath);
    mocha.loadFiles();

    expect(require.cache, 'to have property', require.resolve(filePath));
    mocha.unloadFile(filePath);
    expect(require.cache, 'not to have property', require.resolve(filePath));
  });
});

describe('.unloadFiles()', function() {
  it('should unload all test files from cache', function() {
    var mocha = new Mocha({});
    var testFiles = [
      __filename,
      Path.join(__dirname, 'fs.spec.js'),
      Path.join(__dirname, 'color.spec.js')
    ];

    testFiles.forEach(function(file) {
      mocha.addFile(file);
    });

    mocha.loadFiles();
    testFiles.forEach(function(file) {
      expect(require.cache, 'to have property', require.resolve(file));
    });

    mocha.unloadFiles();
    testFiles.forEach(function(file) {
      expect(require.cache, 'not to have property', require.resolve(file));
    });
  });
});
