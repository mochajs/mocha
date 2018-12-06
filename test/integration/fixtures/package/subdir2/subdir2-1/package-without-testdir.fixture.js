'use strict';

var getTestDirectory = require('../../../../../../bin/options').getTestDirectory;

describe("package.json without directories.test", function() {
  it('test.directories is undefined"', function() {
    console.log(`should never be executed: default directory is ${getTestDirectory()}`);
  });
});
