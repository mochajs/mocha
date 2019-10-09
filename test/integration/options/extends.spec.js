'use strict';

var path = require('path').posix;
var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;

describe.only('--extends', function() {
  var fixture = {
    config: path.join(
      'test',
      'integration',
      'fixtures',
      'options',
      'extends',
      'mocharc.yaml'
    ),
    extends: path.join(
      'test',
      'integration',
      'fixtures',
      'options',
      'extends',
      'mocha-extends.json'
    )
  };

  it('should apply inherited configuration', function(done) {
    var args = ['--config', fixture.config, '--extends', fixture.extends];
    invokeMocha(args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed');
      done();
    });
  });
});
