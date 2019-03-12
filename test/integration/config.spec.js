'use strict';

// this is not a "functional" test; we aren't invoking the mocha executable.
// instead we just avoid test doubles.

var fs = require('fs');
var path = require('path');
var loadConfig = require('../../lib/cli/config').loadConfig;

describe('config', function() {
  it('should return the same values for all supported config types', function() {
    var configDir = path.join(__dirname, 'fixtures', 'config');
    var js = loadConfig(path.join(configDir, 'mocharc.js'));
    var json = loadConfig(path.join(configDir, 'mocharc.json'));
    var yaml = loadConfig(path.join(configDir, 'mocharc.yaml'));
    expect(js, 'to equal', json);
    expect(json, 'to equal', yaml);
  });

  /**
   * @returns {String} pathname to project root directory
   */
  function getProjectRootDir() {
    var searchPaths = module.parent.paths;
    for (var i = 0, len = searchPaths.length; i < len; i++) {
      var searchPath = searchPaths[i];
      if (fs.existsSync(searchPath)) {
        return path.dirname(searchPath);
      }
    }
  }

  it('should load a ".js" config file given relative path', function() {
    var projRootDir = getProjectRootDir();
    var configDir = path.join(__dirname, 'fixtures', 'config');
    var relConfigDir = configDir.substring(projRootDir.length + 1);
    var js;

    function _loadConfig() {
      js = loadConfig(path.join(relConfigDir, 'mocharc.js'));
    }

    expect(_loadConfig, 'not to throw');
    var json = loadConfig(path.join(configDir, 'mocharc.json'));
    expect(js, 'to equal', json);
  });
});
