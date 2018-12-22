'use strict';

// this is not a "functional" test; we aren't invoking the mocha executable.
// instead we just avoid test doubles.

var loadConfig = require('../../lib/cli/config').loadConfig;
var path = require('path');

describe('config', function() {
  it('should return the same values for all supported config types', function() {
    var configDir = path.join(__dirname, 'fixtures', 'config');
    var js = loadConfig(path.join(configDir, 'mocharc.js'));
    var json = loadConfig(path.join(configDir, 'mocharc.json'));
    var yaml = loadConfig(path.join(configDir, 'mocharc.yaml'));
    expect(js, 'to equal', json);
    expect(json, 'to equal', yaml);
  });
});
