'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;
var DEFAULT_FIXTURE = helpers.DEFAULT_FIXTURE;

describe('--inspect', function() {
  it('should start debugger from --inspect', function(done) {
    invokeMocha(
      ['--inspect', DEFAULT_FIXTURE],
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

  it('should start deubgger from --inspect-brk', function(done) {
    var proc = invokeMocha(
      ['--inspect-brk', DEFAULT_FIXTURE],
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

  it('should start debugger if supply both --inspect and --inspect-brk', function(done) {
    var proc = invokeMocha(
      ['--inspect', '--inspect-brk', DEFAULT_FIXTURE],
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
      ['--inspect=127.0.0.1:9229', DEFAULT_FIXTURE],
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

  it('should warn about incorrect usage', function(done) {
    var proc = invokeMocha(
      ['--inspect', '--inspect-brk', DEFAULT_FIXTURE],
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(
          res,
          'to contain output',
          /"--inspect" and "--inspect-brk" together is redundant/i
        );
        done();
      },
      'pipe'
    );

    // debugger must be manually killed
    setTimeout(function() {
      process.kill(proc.pid, 'SIGINT');
    }, 2000);
  });
});
