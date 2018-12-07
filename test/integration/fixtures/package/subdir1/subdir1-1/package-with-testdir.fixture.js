'use strict';

var getTestDirectory = require('../../../../../../bin/options').getTestDirectory;

describe("directories.test of package.json", function() {
  it('test.directories set to "subdir1-1"', function() {
    console.log(`test file found: directory ${getTestDirectory()}`);
  });
});
