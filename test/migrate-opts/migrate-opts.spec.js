'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var command = 'node ./bin/mocha migrate-opts -file ./mocha.opts -type json';
var _path = path.join(process.cwd(), '.mocharc.json');

describe('Test migrate-opts.js script', function() {
  it('should be create file json', function(done) {
    exec(command, function(err) {
      if (err) done(err);
      var ret = fs.existsSync(_path);
      expect(ret).to.be.true;
      fs.unlinkSync(_path);
      done();
    });
  });
});
