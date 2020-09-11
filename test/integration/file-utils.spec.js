'use strict';

var lookupFiles = require('../../lib/cli/lookup-files');
var fs = require('fs');
var path = require('path');
var os = require('os');
var rimraf = require('rimraf');

describe('file utils', function() {
  var tmpDir = path.join(os.tmpdir(), 'mocha-file-lookup');
  var existsSync = fs.existsSync;
  var tmpFile = path.join.bind(path, tmpDir);
  var symlinkSupported = process.platform !== 'win32';

  beforeEach(function() {
    this.timeout(2000);
    makeTempDir();

    fs.writeFileSync(tmpFile('mocha-utils.js'), 'yippy skippy ying yang yow');
    if (symlinkSupported) {
      fs.symlinkSync(tmpFile('mocha-utils.js'), tmpFile('mocha-utils-link.js'));
    }
  });

  describe('lookupFiles', function() {
    it('should not return broken symlink file path', function() {
      if (!symlinkSupported) {
        return this.skip();
      }

      expect(
        lookupFiles(tmpDir, ['js'], false),
        'to contain',
        tmpFile('mocha-utils-link.js'),
        tmpFile('mocha-utils.js')
      ).and('to have length', 2);
      expect(existsSync(tmpFile('mocha-utils-link.js')), 'to be', true);
      fs.renameSync(tmpFile('mocha-utils.js'), tmpFile('bob'));
      expect(existsSync(tmpFile('mocha-utils-link.js')), 'to be', false);
      expect(lookupFiles(tmpDir, ['js'], false), 'to equal', []);
    });

    it('should accept a glob "path" value', function() {
      var res = lookupFiles(tmpFile('mocha-utils*'), ['js'], false).map(
        path.normalize.bind(path)
      );

      var expectedLength = 0;
      var ex = expect(res, 'to contain', tmpFile('mocha-utils.js'));
      expectedLength++;

      if (symlinkSupported) {
        ex = ex.and('to contain', tmpFile('mocha-utils-link.js'));
        expectedLength++;
      }

      ex.and('to have length', expectedLength);
    });

    it('should parse extensions from extensions parameter', function() {
      var nonJsFile = tmpFile('mocha-utils-text.txt');
      fs.writeFileSync(nonJsFile, 'yippy skippy ying yang yow');

      var res = lookupFiles(tmpDir, ['txt'], false);
      expect(res, 'to contain', nonJsFile).and('to have length', 1);
    });

    it('should return only the ".js" file', function() {
      var TsFile = tmpFile('mocha-utils.ts');
      fs.writeFileSync(TsFile, 'yippy skippy ying yang yow');

      var res = lookupFiles(tmpFile('mocha-utils'), ['js'], false).map(
        path.normalize.bind(path)
      );
      expect(res, 'to contain', tmpFile('mocha-utils.js')).and(
        'to have length',
        1
      );
    });

    it('should return ".js" and ".ts" files', function() {
      var TsFile = tmpFile('mocha-utils.ts');
      fs.writeFileSync(TsFile, 'yippy skippy ying yang yow');

      var res = lookupFiles(tmpFile('mocha-utils'), ['js', 'ts'], false).map(
        path.normalize.bind(path)
      );
      expect(
        res,
        'to contain',
        tmpFile('mocha-utils.js'),
        tmpFile('mocha-utils.ts')
      ).and('to have length', 2);
    });

    it('should return ".test.js" files', function() {
      fs.writeFileSync(
        tmpFile('mocha-utils.test.js'),
        'i have a multipart extension'
      );
      var res = lookupFiles(tmpDir, ['test.js'], false).map(
        path.normalize.bind(path)
      );
      expect(res, 'to contain', tmpFile('mocha-utils.test.js')).and(
        'to have length',
        1
      );
    });

    it('should return not return "*test.js" files', function() {
      fs.writeFileSync(
        tmpFile('mocha-utils-test.js'),
        'i do not have a multipart extension'
      );
      var res = lookupFiles(tmpDir, ['test.js'], false).map(
        path.normalize.bind(path)
      );
      expect(res, 'not to contain', tmpFile('mocha-utils-test.js')).and(
        'to have length',
        0
      );
    });

    it('should require the extensions parameter when looking up a file', function() {
      var dirLookup = function() {
        return lookupFiles(tmpFile('mocha-utils'), undefined, false);
      };
      expect(dirLookup, 'to throw', {
        name: 'Error',
        code: 'ERR_MOCHA_NO_FILES_MATCH_PATTERN'
      });
    });

    it('should require the extensions parameter when looking up a directory', function() {
      var dirLookup = function() {
        return lookupFiles(tmpDir, undefined, false);
      };
      expect(dirLookup, 'to throw', {
        name: 'TypeError',
        code: 'ERR_MOCHA_INVALID_ARG_TYPE',
        argument: 'extensions'
      });
    });
  });

  afterEach(removeTempDir);

  function makeTempDir() {
    fs.mkdirSync(tmpDir, {recursive: true});
  }

  function removeTempDir() {
    rimraf.sync(tmpDir);
  }
});
