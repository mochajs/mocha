'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;
var invokeMocha = helpers.invokeMocha;
var resolvePath = helpers.resolveFixturePath;

describe('--opts', function() {
  var args = [];
  var fixture = path.join('options', 'opts');

  it('should work despite nonexistent default options file', function(done) {
    args = [];
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed').and('to have passed test count', 1);
      done();
    });
  });

  it('should throw an error due to nonexistent options file', function(done) {
    var spawnOpts = {stdio: 'pipe'};
    var nonexistentFile = 'nosuchoptionsfile';
    args = ['--opts', nonexistentFile, resolvePath(fixture)];
    invokeMocha(
      args,
      function(err, res) {
        if (err) {
          return done(err);
        }

        var pattern = 'unable to read ' + nonexistentFile;
        expect(res, 'to satisfy', {
          code: 1,
          output: new RegExp(pattern, 'i')
        });
        done();
      },
      spawnOpts
    );
  });
});
