'use strict';

var utils = require('../../lib/utils');
var fs = require('fs');
var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

describe('lookupFiles', function() {
  var tmpDir = path.join(os.tmpDir(), 'mocha-lookup-files');
  var existsSync = fs.existsSync;
  var tmpFile = path.join.bind(path, tmpDir);
  var symlinkSupported = false;

  (function testSymlinkSupport() {
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

  beforeEach(function() {
    makeTempDir();

    fs.writeFileSync(tmpFile('mocha-utils.js'), 'yippy skippy ying yang yow');
    if (symlinkSupported) {
      fs.symlinkSync(tmpFile('mocha-utils.js'), tmpFile('mocha-utils-link.js'));
    }
  });

  (symlinkSupported ? it : it.skip)('should not choke on symlinks', function() {
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

  it('should accept a glob "path" value', function() {
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

  afterEach(removeTempDir);

  function makeTempDir() {
    mkdirp.sync(tmpDir);
  }

  function removeTempDir() {
    rimraf.sync(tmpDir);
  }
});
