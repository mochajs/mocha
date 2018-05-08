'use strict';

var path = require('path');
var fs = require('fs');

it('should build a non-broken bundle for AMD', function(done) {
  var bundle = path.join(process.cwd(), 'mocha.js');
  fs.readFile(bundle, 'utf8', function(err, content) {
    if (err) {
      return done(err);
    }

    expect(content, 'not to match', /define.amd/);
    done();
  });
});
