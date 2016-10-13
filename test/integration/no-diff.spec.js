'use strict';

var helpers = require('./helpers');
var run = helpers.runMocha;

describe('no-diff', function () {
  it('should be honoured', function (done) {
    run('no-diff.fixture.js', ['--no-diff'], function (err, res) {
      res.output.should.not.match(/\+ expected/);
      res.output.should.not.match(/- actual/);
      done(err);
    });
  });
});
