'use strict';

const assert = require('node:assert');
const run = require('./helpers').runMocha;
const args = [];

describe('utils.deprecate test', function () {
  it('should print unique deprecation only once', function (done) {
    run(
      'deprecate.fixture.js',
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        const result = res.output.match(/deprecated thing/g) || [];
        assert.strictEqual(result.length, 2);
        done();
      },
      {stdio: 'pipe'}
    );
  });
});
