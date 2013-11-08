var rewire = require('rewire'),
    util = require('util');

describe('Base reporter', function () {
  var Base, output;

  beforeEach(function() {
    Base = rewire('../../lib/reporters/base');
    output = { log: [], error: [] };
    Base.__set__('console', {
      error: function() {
        output.error.push(arguments);
      },
      log: function() {
        output.log.push(arguments);
      },
      // allow info to be passed to original 'console' for debugging purposes
      info: console.info
    });
  });

  it('does not show diffs when showDiff property set', function () {
    var err = new Error('test');
    err.actual = "a1";
    err.expected = "e1";
    err.showDiff = false;
    var test = {
      err: err,
      fullTitle: function() { return 'title'; }
    };

    Base.list([test]);

    var errOut = output.error.map(function(lineArgs) {
      return util.format.apply(null, lineArgs);
    }).join('\n');

    errOut.should.include('test');
    errOut.should.not.include('actual');
    errOut.should.not.include('expected');
  });
});
