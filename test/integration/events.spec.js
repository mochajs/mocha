'use strict';

var helpers = require('./helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('event order', function () {
  describe('trivial test case', function () {
    it('should assert trivial event order', function (done) {
      runMochaJSON('runner/events-basic.fixture.js', [], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 2)
          .and('to have passed test order', 'test A', 'test B')
          .and('to have failed test count', 0);
        done();
      });
    });
  });

  describe('--bail test case', function () {
    it('should assert --bail event order', function (done) {
      runMochaJSON(
        'runner/events-bail.fixture.js',
        ['--bail'],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have failed with error', 'error test A')
            .and('to have failed test count', 1)
            .and('to have passed test count', 0);
          done();
        }
      );
    });
  });

  describe('--retries test case', function () {
    it('should assert --retries event order', function (done) {
      runMochaJSON(
        'runner/events-retries.fixture.js',
        ['--retries', '1'],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have failed with error', 'error test A')
            .and('to have failed test count', 1)
            .and('to have passed test count', 0);
          done();
        }
      );
    });
  });

  describe('--repeats test case', function () {
    it('should assert --repeats event order', function (done) {
      runMochaJSON(
        'runner/events-repeats.fixture.js',
        ['--repeats', '2'],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed')
            .and('to have failed test count', 0)
            .and('to have passed test count', 1);
          done();
        }
      );
    });
  });

  describe('--delay test case', function () {
    it('should assert --delay event order', function (done) {
      runMochaJSON(
        'runner/events-delay.fixture.js',
        ['--delay'],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed')
            .and('to have passed test count', 2)
            .and('to have passed test order', 'test A', 'test B')
            .and('to have failed test count', 0);
          done();
        }
      );
    });
  });

  describe('--retries and --bail test case', function () {
    it('should assert --retries event order', function (done) {
      runMochaJSON(
        'runner/events-bail-retries.fixture.js',
        ['--retries', '1', '--bail'],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have failed with error', 'error test A')
            .and('to have failed test count', 1)
            .and('to have passed test count', 0);
          done();
        }
      );
    });
  });
});
