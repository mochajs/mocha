'use strict';

var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--ui', function () {
  var simpleUiPath = require.resolve('../fixtures/simple-ui.fixture');

  it('should load interface and run it', function (done) {
    runMochaJSON(
      'test-for-simple-ui',
      ['--ui', simpleUiPath],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      }
    );
  });

  it("should work if required and name added to Mocha's `interfaces` prop", function (done) {
    runMochaJSON(
      'test-for-simple-ui',
      ['--require', simpleUiPath, '--ui', 'simple-ui'],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      }
    );
  });
});
