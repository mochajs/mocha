'use strict';
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var migrateOpts = require('../../scripts/migrate-opts');
var types = ['json', 'js', 'yml', 'yaml'];

describe('Test migrate-opts.js script', function() {
  types.forEach(function(type) {
    it('should be worked writeFile ' + type, function() {
      var filepath = path.join(process.cwd(), './test/migrate-opts/mocha.opts');
      var _path = path.join(process.cwd(), './test/migrate-opts');
      migrateOpts.init(filepath, type, _path);
      var __path = path.join(
        process.cwd(),
        './test/migrate-opts',
        '.mocharc.' + type
      );
      var isFile = fs.existsSync(__path);
      expect(isFile).to.equal(true);
      if (isFile) fs.unlinkSync(__path);
    });
  });
  after(function() {
    types.forEach(function(type) {
      var __path = path.join(
        process.cwd(),
        './test/migrate-opts',
        '.mocharc.' + type
      );
      var isFile = fs.existsSync(__path);
      if (isFile) fs.unlinkSync(__path);
    });
  });
});
