'use strict';

const fs = require('node:fs');
const rimraf = require('rimraf');
const invokeMocha = require('./helpers').invokeMocha;
const path = require('node:path');
const os = require('node:os');

describe('init command', function () {
  let tmpdir;

  beforeEach(function () {
    tmpdir = path.join(os.tmpdir(), 'mocha-init');
    try {
      fs.mkdirSync(tmpdir);
    } catch (ignored) {}
    expect(fs.existsSync(tmpdir), 'to be true');
  });

  afterEach(function () {
    try {
      rimraf.sync(tmpdir);
    } catch (ignored) {}
  });

  describe('when no path is supplied', function () {
    it('should fail', function (done) {
      invokeMocha(
        ['init'],
        function (err, result) {
          if (err) {
            return done(err);
          }
          expect(
            result,
            'to have failed with output',
            /not enough non-option arguments/i
          );
          done();
        },
        {stdio: 'pipe'}
      );
    });
    it('should not throw', function (done) {
      invokeMocha(
        ['init'],
        function (err, result) {
          if (err) {
            return done(err);
          }
          expect(result, 'to have failed').and('not to satisfy', {
            output: /throw/i
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });
  });

  it('should create some files in the dest dir', function (done) {
    invokeMocha(
      ['init', tmpdir],
      function (err, result) {
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
