var Mocha = require('../../../')
  , assert = require('assert')
  , path = require('path');

var testFile = path.resolve(__dirname, 'spec.js');
var includeFile = path.resolve(__dirname, 'include.js');

var set1 = new Mocha();
set1.dropRequireCacheBeforeRun();
set1.addFile(testFile);

var set2 = new Mocha();
set2.dropRequireCacheBeforeRun();
set2.addFile(testFile);

set1.run(function () {
  assert.strictEqual(global[includeFile], 1, 'JSAPI test #1 didn\'t run');

  set2.run(function () {
    assert.strictEqual(global[includeFile], 2, 'JSAPI test #2 didn\'t run');
  });
});
