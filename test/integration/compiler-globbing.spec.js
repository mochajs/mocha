'use strict';

var expect = require('expect.js');
var exec = require('child_process').exec;
var path = require('path');

describe('globbing like --compilers', function () {
  it('should find a file of each type', function (done) {
    exec('"' + process.execPath + '" "' + path.join('..', 'bin', 'mocha') + '" --require compiler-fixtures/foo.js -R json "./compiler/*.@(coffee,foo)"', { cwd: path.join(__dirname, '..') }, function (error, stdout) {
      if (error) { return done(error); }
      var results = JSON.parse(stdout);
      expect(results).to.have.property('passes');
      var titles = [];
      for (var index = 0; index < results.passes.length; index += 1) {
        expect(results.passes[index]).to.have.property('fullTitle');
        titles.push(results.passes[index].fullTitle);
      }
      expect(results.passes).to.have.length(2);
      expect(results.passes).to.contain('coffeescript should work');
      expect(results.passes).to.contain('custom compiler should work');
      done();
    });
  });
});
