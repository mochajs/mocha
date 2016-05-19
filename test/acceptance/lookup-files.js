var utils = require('../../lib/utils');

describe('lookupFiles', function() {
  var fs = require('fs'), path = require('path'), existsSync = fs.existsSync ||
    path.existsSync;

  beforeEach(function() {
    fs.writeFileSync('/tmp/mocha-utils.js', 'yippy skippy ying yang yow');
    fs.symlinkSync('/tmp/mocha-utils.js', '/tmp/mocha-utils-link.js');
  });

  it('should not choke on symlinks', function() {
    expect(utils.lookupFiles('/tmp', ['js'], false))
      .to
      .contain('/tmp/mocha-utils-link.js')
      .and
      .contain('/tmp/mocha-utils.js')
      .and
      .have
      .length(2);
    expect(existsSync('/tmp/mocha-utils-link.js'))
      .to
      .be(true);
    fs.renameSync('/tmp/mocha-utils.js', '/tmp/bob');
    expect(existsSync('/tmp/mocha-utils-link.js'))
      .to
      .be(false);
    expect(utils.lookupFiles('/tmp', ['js'], false))
      .to
      .eql([]);
  });

  it('should accept a glob "path" value', function() {
    expect(utils.lookupFiles('/tmp/mocha-utils*', ['js'], false))
      .to
      .contain('/tmp/mocha-utils-link.js')
      .and
      .contain('/tmp/mocha-utils.js')
      .and
      .have
      .length(2);
  });

  afterEach(function() {
    [
      '/tmp/mocha-utils.js',
      '/tmp/mocha-utils-link.js',
      '/tmp/bob'
    ].forEach(function(path) {
      try {
        fs.unlinkSync(path);
      } catch (ignored) {
      }
    });
  });
});
