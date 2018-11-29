'use strict';

var assert = require('assert');
var run = require('./helpers').runMocha;
var args = [];

describe('utils.deprecate test', function() {
  it('should print unique deprecation only once', function(done) {
    run(
      'deprecate.fixture.js',
      args,
      function(err, res) {
        if (err) {
          return done(err);
        }
        var result = res.output.match(/deprecated thing/g) || [];
        assert.equal(result.length, 2);
        done();
      },
      {stdio: 'pipe'}
    );
  });
});
