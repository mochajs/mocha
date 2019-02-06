'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;
var DEFAULT_FIXTURE = helpers.DEFAULT_FIXTURE;

describe('--debug', function() {
  describe('Node.js v8+', function() {
    before(function() {
      if (process.version.substring(0, 2) === 'v6') {
        this.skip();
      }
    });

    it('should invoke --inspect', function(done) {
      invokeMocha(
        ['--debug', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to contain output', /Debugger listening/i);
          done();
        },
        'pipe'
      );
    });

    it('should invoke --inspect-brk', function(done) {
      var proc = invokeMocha(
        ['--debug-brk', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to contain output', /Debugger listening/i);
          done();
        },
        'pipe'
      );

      // debugger must be manually killed
      setTimeout(function() {
        process.kill(proc.pid, 'SIGINT');
      }, 2000);
    });

    it('should respect custom host/port', function(done) {
      invokeMocha(
        ['--debug=127.0.0.1:9229', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(
            res,
            'to contain output',
            /Debugger listening on .*127.0.0.1:9229/i
          );
          done();
        },
        'pipe'
      );
    });

    it('should warn about incorrect usage for version', function(done) {
      invokeMocha(
        ['--debug=127.0.0.1:9229', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to contain output', /"--debug" is not available/i);
          done();
        },
        'pipe'
      );
    });
  });

  describe('Node.js v6', function() {
    // note that v6.3.0 and newer supports --inspect but still supports --debug.
    before(function() {
      if (process.version.substring(0, 2) !== 'v6') {
        this.skip();
      }
    });

    it('should start debugger', function(done) {
      var proc = invokeMocha(
        ['--debug', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to contain output', /Debugger listening/i);
          done();
        },
        'pipe'
      );

      // debugger must be manually killed
      setTimeout(function() {
        process.kill(proc.pid, 'SIGINT');
      }, 2000);
    });

    it('should respect custom host/port', function(done) {
      var proc = invokeMocha(
        ['--debug=127.0.0.1:9229', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(
            res,
            'to contain output',
            /Debugger listening on .*127.0.0.1:9229/i
          );
          done();
        },
        'pipe'
      );

      setTimeout(function() {
        process.kill(proc.pid, 'SIGINT');
      }, 2000);
    });
  });
});
