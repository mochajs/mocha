'use strict';

var path = require('path');
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--parallel', function() {
  it('should not appear fundamentally different than without', function(done) {
    runMochaJSON(
      path.join('options', 'parallel', '*.fixture.js'),
      ['--parallel'],
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed')
          .and('to have passed test count', 2)
          .and('to have pending test count', 1)
          .and('to have failed test count', 2);
        done();
      }
    );
  });
});
