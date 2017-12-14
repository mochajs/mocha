'use strict';

var utils = require('../../lib/utils');
var fs = require('fs');
var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

describe('file utils', function () {
  var tmpDir = path.join(os.tmpdir(), 'mocha-file-lookup');
  var existsSync = fs.existsSync;
  var tmpFile = path.join.bind(path, tmpDir);
  var symlinkSupported = false;

  (function testSymlinkSupport () {
    makeTempDir();

    fs.writeFileSync(tmpFile('mocha-utils.js'), 'yippy skippy ying yang yow');
    try {
      fs.symlinkSync(tmpFile('mocha-utils.js'), tmpFile('mocha-utils-link.js'));
      symlinkSupported = true;
    } catch (ignored) {
      // ignored
    } finally {
      removeTempDir();
    }
  }());

  beforeEach(function () {
    this.timeout(2000);
    makeTempDir();

    fs.writeFileSync(tmpFile('mocha-utils.js'), 'yippy skippy ying yang yow');
    if (symlinkSupported) {
      fs.symlinkSync(tmpFile('mocha-utils.js'), tmpFile('mocha-utils-link.js'));
    }
  });

  describe('.lookupFiles', function () {
    (symlinkSupported ? it : it.skip)('should not return broken symlink file path', function () {
      expect(utils.lookupFiles(tmpDir, ['js'], false))
        .to
        .contain(tmpFile('mocha-utils-link.js'))
        .and
        .contain(tmpFile('mocha-utils.js'))
        .and
        .have
        .length(2);
      expect(existsSync(tmpFile('mocha-utils-link.js')))
        .to
        .be(true);
      fs.renameSync(tmpFile('mocha-utils.js'), tmpFile('bob'));
      expect(existsSync(tmpFile('mocha-utils-link.js')))
        .to
        .be(false);
      expect(utils.lookupFiles(tmpDir, ['js'], false))
        .to
        .eql([]);
    });

    it('should accept a glob "path" value', function () {
      var res = utils.lookupFiles(tmpFile('mocha-utils*'), ['js'], false)
        .map(path.normalize.bind(path));

      var expectedLength = 0;
      var ex = expect(res)
        .to
        .contain(tmpFile('mocha-utils.js'));
      expectedLength++;

      if (symlinkSupported) {
        ex = ex.and
          .contain(tmpFile('mocha-utils-link.js'));
        expectedLength++;
      }

      ex.and
        .have
        .length(expectedLength);
    });

    it('should parse extensions from extnsions parameter', function () {
      var nonJsFile = tmpFile('mocha-utils-text.txt');
      fs.writeFileSync(nonJsFile, 'yippy skippy ying yang yow');

      var res = utils.lookupFiles(tmpDir, ['txt'], false);
      expect(res).to.contain(nonJsFile).and.to.have.length(1);
    });

    it('should not require the extensions parameter when looking up a file', function () {
      var res = utils.lookupFiles(tmpFile('mocha-utils'), undefined, false);
      expect(res).to.equal(tmpFile('mocha-utils.js'));
    });

    it('should require the extensions parameter when looking up a directory', function () {
      var dirLookup = function () {
        return utils.lookupFiles(tmpDir, undefined, false);
      };
      expect(dirLookup).to.throwError();
    });
  });

  describe('.files', function () {
    (symlinkSupported ? it : it.skip)('should return broken symlink file path', function () {
      expect(utils.files(tmpDir, ['js']))
        .to.contain(tmpFile('mocha-utils-link.js'))
        .and.contain(tmpFile('mocha-utils.js'))
        .and.have.length(2);

      expect(existsSync(tmpFile('mocha-utils-link.js')))
        .to.be(true);

      fs.renameSync(tmpFile('mocha-utils.js'), tmpFile('bob'));

      expect(existsSync(tmpFile('mocha-utils-link.js')))
        .to.be(false);

      expect(utils.files(tmpDir, ['js']))
        .to.eql([tmpFile('mocha-utils-link.js')]);
    });
  });

  afterEach(removeTempDir);

  function makeTempDir () {
    mkdirp.sync(tmpDir);
  }

  function removeTempDir () {
    rimraf.sync(tmpDir);
  }
});
