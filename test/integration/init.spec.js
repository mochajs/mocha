'use strict';

var fs = require('fs');
var rimraf = require('rimraf');
var invokeMocha = require('./helpers').invokeMocha;
var path = require('path');
var os = require('os');

describe('init command', function() {
  var tmpdir;

  beforeEach(function() {
    tmpdir = path.join(os.tmpdir(), 'mocha-init');
    try {
      fs.mkdirSync(tmpdir);
    } catch (ignored) {}
    expect(fs.existsSync(tmpdir), 'to be true');
  });

  afterEach(function() {
    try {
      rimraf.sync(tmpdir);
    } catch (ignored) {}
  });

  it('should break if no path supplied', function(done) {
    invokeMocha(
      ['init'],
      function(err, result) {
        if (err) {
          return done(err);
        }
        expect(result, 'to have failed');
        expect(result.output, 'to match', /not enough non-option arguments/i);
        done();
      },
      {stdio: 'pipe'}
    );
  });

  it('should create some files in the dest dir', function(done) {
    invokeMocha(
      ['init', tmpdir],
      function(err, result) {
        if (err) {
          return done(err);
        }
        expect(result, 'to have succeeded');
        expect(fs.existsSync(path.join(tmpdir, 'mocha.css')), 'to be true');
        expect(fs.existsSync(path.join(tmpdir, 'mocha.js')), 'to be true');
        expect(fs.existsSync(path.join(tmpdir, 'tests.spec.js')), 'to be true');
        expect(fs.existsSync(path.join(tmpdir, 'index.html')), 'to be true');
        done();
      },
      {stdio: 'pipe'}
    );
  });
});
