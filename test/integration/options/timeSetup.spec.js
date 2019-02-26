'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--time-setup', function() {
  var args = [];

  describe('with the option', function() {
    before(function() {
      args = ['--time-setup'];
    });

    it('should include the setup time', function(done) {
      var fixture = path.join('options', 'time-setup');
      runMochaJSON(fixture, args, function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.tests[0].duration, 'to be greater than or equal to', 20);
        done();
      });
    });
  });

  it('should not include the setup time if --time-setup is not specified', function(done) {
    var fixture = path.join('options', 'time-setup');
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res.tests[0].duration, 'to be less than', 20);
      done();
    });
  });
});
