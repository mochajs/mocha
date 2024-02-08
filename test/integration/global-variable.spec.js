'use strict';
var mochaPackageJson = require('../../package.json');
var version = mochaPackageJson.version;
var name = mochaPackageJson.name;

describe('Global "mocha" object', function () {
  it('should have the properties name and version', function () {
    expect(globalThis.mochaVar.name, 'to equal', name);
    expect(globalThis.mochaVar.version, 'to equal', version);
  });
});
