'use strict';

var expect = require('expect.js');
var exec = require('child_process').exec;
var path = require('path');

describe('globbing like --compilers', function () {
  it('should find a file of each type', function (done) {
    exec('"' + process.execPath + '" "' + path.join('bin', 'mocha') + '" -R json --require coffee-script/register --require test/compiler-fixtures/foo.fixture "test/compiler/*.@(coffee|foo)"', { cwd: path.join(__dirname, '..', '..') }, function (error, stdout) {
      if (error && !stdout) { return done(error); }
      var results = JSON.parse(stdout);
      expect(results).to.have.property('tests');
      var titles = [];
      for (var index = 0; index < results.tests.length; index += 1) {
        expect(results.tests[index]).to.have.property('fullTitle');
        titles.push(results.tests[index].fullTitle);
      }
      expect(titles).to.contain('coffeescript should work');
      expect(titles).to.contain('custom compiler should work');
      expect(titles).to.have.length(2);
      done();
    });
  });
});
