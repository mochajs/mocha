'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;
var toJSONResult = helpers.toJSONResult;

describe('--extension', function() {
  it('should allow comma-separated variables', function(done) {
    var args = [
      '--require',
      'coffee-script/register',
      '--require',
      './test/setup',
      '--reporter',
      'json',
      '--extension',
      'js,coffee',
      'test/integration/fixtures/options/extension'
    ];
    invokeMocha(args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(toJSONResult(res), 'to have passed').and(
        'to have passed test count',
        2
      );
      done();
    });
  });

  it('should allow extensions beginning with a dot', function(done) {
    var args = [
      '--require',
      'coffee-script/register',
      '--require',
      './test/setup',
      '--reporter',
      'json',
      '--extension',
      '.js',
      'test/integration/fixtures/options/extension'
    ];
    invokeMocha(args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(toJSONResult(res), 'to have passed').and(
        'to have passed test count',
        1
      );
      done();
    });
  });
});
