'use strict';

var getTestDirectory = require('../../../../../../bin/options').getTestDirectory;

describe('no directories.test in package.json', function() {
  it('use default test directory', function() {
    console.log(`test file found: default directory ${getTestDirectory()}`);
  });
});
