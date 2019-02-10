'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;
var escapeRegExp = helpers.escapeRegExp;
var reporters = require('../../../lib/mocha').reporters;

describe('--reporters', function() {
  it('should dump a list of all reporters with descriptions', function(done) {
    var expected = Object.keys(reporters)
      .filter(function(name) {
        return (
          /^[a-z]/.test(name) &&
          !(reporters[name].abstract || reporters[name].browserOnly)
        );
      })
      .map(function(name) {
        return {
          name: escapeRegExp(name),
          description: escapeRegExp(reporters[name].description)
        };
      });

    invokeMocha(['--reporters'], function(err, result) {
      if (err) {
        return done(err);
      }

      expect(result.code, 'to be', 0);
      expected.forEach(function(reporter) {
        expect(
          result.output,
          'to match',
          new RegExp(reporter.name + '\\s*-\\s*' + reporter.description)
        );
      });
      done();
    });
  });
});
