'use strict';

// This test ensures Mocha's dependencies are properly in place,
// and is intended to be run after an `npm install --production` in a clean
// working copy. It helps avoid publishing Mocha with `dependencies`
// in `devDependencies` or otherwise in the wrong place.
// It does not ensure that all files are present in the published package!

var assert = require('node:assert');

describe('a production installation of Mocha', function () {
  it('should be able to execute a test', function () {
    assert.ok(true);
  });
});
