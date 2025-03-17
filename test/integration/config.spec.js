'use strict';

// This is not a "functional" test; we aren't invoking the mocha executable.
// Instead we just avoid test doubles.

const fs = require('node:fs');
const path = require('node:path');
const loadConfig = require('../../lib/cli/config').loadConfig;

describe('config', function () {
  it('should return the same values for all supported config types', function () {
    const configDir = path.join(__dirname, 'fixtures', 'config');
    const js = loadConfig(path.join(configDir, 'mocharc.js'));
    const cjs = loadConfig(path.join(configDir, 'mocharc.cjs'));
    const json = loadConfig(path.join(configDir, 'mocharc.json'));
    const yaml = loadConfig(path.join(configDir, 'mocharc.yaml'));
    expect(js, 'to equal', json);
    expect(js, 'to equal', cjs);
    expect(json, 'to equal', yaml);
  });

  describe('when configuring Mocha via a ".js" file', function () {
    const projRootDir = path.join(__dirname, '..', '..');
    const configDir = path.join(__dirname, 'fixtures', 'config');
    const json = loadConfig(path.join(configDir, 'mocharc.json'));

    it('should load configuration given absolute path', function () {
      let js;

      function _loadConfig () {
        js = loadConfig(path.join(configDir, 'mocharc.js'));
      }

      expect(_loadConfig, 'not to throw');
      expect(js, 'to equal', json);
    });

    it('should load configuration given cwd-relative path', function () {
      const relConfigDir = configDir.substring(projRootDir.length + 1);
      let js;

      function _loadConfig () {
        js = loadConfig(path.join('.', relConfigDir, 'mocharc.js'));
      }

      expect(_loadConfig, 'not to throw');
      expect(js, 'to equal', json);
    });

    it('should rethrow error from absolute path configuration', function () {
      function _loadConfig () {
        loadConfig(path.join(configDir, 'mocharcWithThrowError.js'));
      }

      expect(_loadConfig, 'to throw', {
        message: /Error from mocharcWithThrowError/
      });
    });

    it('should rethrow error from cwd-relative path configuration', function () {
      const relConfigDir = configDir.substring(projRootDir.length + 1);

      function _loadConfig () {
        loadConfig(path.join('.', relConfigDir, 'mocharcWithThrowError.js'));
      }

      expect(_loadConfig, 'to throw', {
        message: /Error from mocharcWithThrowError/
      });
    });

    // In other words, path does not begin with '/', './', or '../'
    describe('when path is neither absolute or relative', function () {
      const nodeModulesDir = path.join(projRootDir, 'node_modules');
      const pkgName = 'mocha-config';
      let installedLocally = false;
      let symlinkedPkg = false;

      before(function () {
        try {
          const srcPath = path.join(configDir, pkgName);
          const targetPath = path.join(nodeModulesDir, pkgName);
          fs.symlinkSync(srcPath, targetPath, 'dir');
          symlinkedPkg = true;
          installedLocally = true;
        } catch (err) {
          if (err.code === 'EEXIST') {
            console.log('setup:', 'package already exists in "node_modules"');
            installedLocally = true;
          } else {
            console.error('setup failed:', err);
          }
        }
      });

      it('should load configuration given module-relative path', function () {
        let js;

        if (!installedLocally) {
          return this.skip();
        }

        function _loadConfig () {
          js = loadConfig(path.join(pkgName, 'index.js'));
        }

        expect(_loadConfig, 'not to throw');
        expect(js, 'to equal', json);
      });

      after(function () {
        if (symlinkedPkg) {
          try {
            fs.unlinkSync(path.join(nodeModulesDir, pkgName));
          } catch (err) {
            console.error('teardown failed:', err);
          }
        }
      });
    });
  });
});
