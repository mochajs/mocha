'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--sort', function () {
  var args = [];

  before(function () {
    args = ['--sort'];
  });

  it('should sort tests in alphabetical order', function (done) {
    var fixtures = path.join('options', 'sort*');
    runMochaJSON(fixtures, args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have passed test count', 2).and(
        'to have passed test order',
        'should be executed first'
      );
      done();
    });
  });
});
