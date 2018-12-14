'use strict';

var helpers = require('./helpers');
var invokeMocha = helpers.invokeMocha;
var invokeSubMocha = helpers.invokeSubMocha;

var fixturePath = require.resolve('./fixtures/sigint.fixture');

describe('SIGINT handling', function() {
  describe('using "mocha" wrapper', function() {
    describe('when SIGINT received', function() {
      it('should terminate itself w/ SIGTERM', function(done) {
        var proc = invokeMocha([fixturePath, '--timeout', '10000']).on(
          'exit',
          function(code, signal) {
            expect(code, 'to be', null);
            expect(signal, 'to be', 'SIGTERM');
            done();
          }
        );
        setTimeout(function() {
          process.kill(proc.pid, 'SIGINT');
        }, 1000);
      });
    });
  });

  describe('using cli module', function() {
    describe('when SIGINT received', function() {
      it('should terminate itself w/ SIGINT', function(done) {
        var proc = invokeSubMocha([fixturePath, '--timeout', '10000']).on(
          'exit',
          function(code, signal) {
            expect(code, 'to be', null);
            expect(signal, 'to be', 'SIGINT');
            done();
          }
        );
        setTimeout(function() {
          process.kill(proc.pid, 'SIGINT');
        }, 1000);
      });
    });
  });
});
