'use strict';

var invokeMocha = require('../helpers').invokeMocha;

describe('node flags', function() {
  it('should not consider argument values to be node flags', function(done) {
    invokeMocha(
      ['--require', 'trace-dependency'],
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'not to have failed with output', /bad option/i);
        done();
      },
      'pipe'
    );
  });
});

describe('node flags using "--node-option"', function() {
  it('should pass fake option to node and fail with node exception', function(done) {
    invokeMocha(
      ['--node-option', 'fake-flag'],
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', /bad option: --fake-flag/i);
        done();
      },
      'pipe'
    );
  });
});
