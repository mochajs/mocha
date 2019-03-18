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
   * @returns {String} pathname to Mocha project root directory
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

  describe('when configuring Mocha via a ".js" file', function() {
    var configDir = path.join(__dirname, 'fixtures', 'config');
    var json = loadConfig(path.join(configDir, 'mocharc.json'));

    it('should load configuration given absolute path', function() {
      var js;

      function _loadConfig() {
        js = loadConfig(path.join(configDir, 'mocharc.js'));
      }

      expect(_loadConfig, 'not to throw');
      expect(js, 'to equal', json);
    });

    it('should load configuration given relative path', function() {
      var projRootDir = getProjectRootDir();
      var relConfigDir = configDir.substring(projRootDir.length + 1);
      var js;

      function _loadConfig() {
        js = loadConfig(path.join('.', relConfigDir, 'mocharc.js'));
      }

      expect(_loadConfig, 'not to throw');
      expect(js, 'to equal', json);
    });
  });

  describe('when configuring Mocha via package', function() {
    var projRootDir = getProjectRootDir();
    var modulesDir = path.join(projRootDir, 'node_modules');
    var configDir = path.join(__dirname, 'fixtures', 'config');
    var pkgName = 'mocha-config';
    var addedPkgToNodeModules = false;
    var pkgInNodeModules = false;

    before(function() {
      try {
        var srcPath = path.join(configDir, pkgName);
        var targetPath = path.join(modulesDir, pkgName);
        fs.symlinkSync(srcPath, targetPath, 'dir');
        pkgInNodeModules = true;
        addedPkgToNodeModules = true;
        if (process.platform !== 'win32') {
          require('child_process').execSync('ls -al ' + targetPath);
        }
      } catch (err) {
        if (err.code === 'EEXIST') {
          console.log('setup:', 'package already exists in "node_modules"');
          pkgInNodeModules = true;
        } else {
          console.error('setup failed:', err);
        }
      }
    });

    it('should load configuration given valid package name', function() {
      var js;

      if (!pkgInNodeModules) {
        this.skip();
      }

      try {
        console.log('require.resolve:', require.resolve(pkgName));
      } catch (err) {
        console.error('require.resolve:', err);
      }

      function _loadConfig() {
        js = loadConfig(pkgName);
      }

      expect(_loadConfig, 'not to throw');
      var json = loadConfig(path.join(configDir, 'mocharc.json'));
      expect(js, 'to equal', json);
    });

    it('should throw given invalid package name', function() {
      function _loadConfig() {
        loadConfig(pkgName.toUpperCase());
      }

      expect(_loadConfig, 'to throw');
    });

    after(function() {
      if (addedPkgToNodeModules) {
        try {
          fs.unlinkSync(path.join(modulesDir, pkgName));
        } catch (err) {
          console.error('teardown failed:', err);
        }
      }
    });
  });
});
