'use strict';

var Mocha = require('../../lib/mocha');

describe('.unloadFile()', function() {
  it('should load and unload file to/from cache', function() {
    var mocha = new Mocha({});
    var filePath = __filename;
    mocha.addFile(filePath);
    mocha.loadFiles();

    expect(
      require.cache[require.resolve(filePath)] !== undefined,
      'to be',
      true
    );
    mocha.unloadFile(filePath);
    expect(require.cache[require.resolve(filePath)], 'to be', undefined);
  });
});

describe('.unloadFiles()', function() {
  it('should unload all test files from cache', function() {
    var mocha = new Mocha({});
    var filePath = __filename;
    mocha.addFile(filePath);
    mocha.loadFiles();

    expect(
      require.cache[require.resolve(filePath)] !== undefined,
      'to be',
      true
    );
    mocha.unloadFiles();
    expect(require.cache[require.resolve(filePath)], 'to be', undefined);
  });
});
