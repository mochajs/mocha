'use strict';

var invokeMocha = require('./helpers').invokeMocha;
var Mocha = require('../../lib/mocha');
var reporters = Mocha.reporters;
var interfaces = Mocha.interfaces;

// thanks MDN
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

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

describe('--interfaces', function() {
  it('should dump a list of all interfaces with descriptions', function(done) {
    var expected = Object.keys(interfaces)
      .filter(function(name) {
        return /^[a-z]/.test(name);
      })
      .map(function(name) {
        return {
          name: escapeRegExp(name),
          description: escapeRegExp(interfaces[name].description)
        };
      });

    invokeMocha(['--interfaces'], function(err, result) {
      if (err) {
        return done(err);
      }

      expect(result.code, 'to be', 0);
      expected.forEach(function(ui) {
        expect(
          result.output,
          'to match',
          new RegExp(ui.name + '\\s*-\\s*' + ui.description)
        );
      });
      done();
    });
  });
});
