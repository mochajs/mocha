'use strict';
var ms = require('../../lib/ms');

describe('.ms()', function () {
  // Helpers
  var time = {
    minutes: function (n) { return n * 60 * 1000; },
    hours: function (n) { return n * this.minutes(60); },
    days: function (n) { return n * this.hours(24); },
    years: function (n) { return n * this.days(365.25); }
  };
  describe('get a value that less than 1 second', function () {
    it('should return milliseconds representation', function () {
      expect(ms(200)).to.equal('200ms');
      expect(ms(30)).to.equal('30ms');
      expect(ms(2000)).to.not.equal('2000ms');
    });
  });

  describe('seconds representation', function () {
    it('should return short format', function () {
      expect(ms(2000)).to.equal('2s');
    });
  });

  describe('minutes representation', function () {
    it('should return short format', function () {
      expect(ms(time.minutes(1))).to.equal('1m');
    });
  });

  describe('hours representation', function () {
    it('should return short format', function () {
      expect(ms(time.hours(1))).to.equal('1h');
    });
  });

  describe('days representation', function () {
    it('should return short format', function () {
      expect(ms(time.days(1))).to.equal('1d');
    });
  });

  describe('Getting string value', function () {
    it('should return the milliseconds representation(Number)', function () {
      expect(ms('1 second')).to.equal(1000);

      expect(ms('1 minute')).to.equal(time.minutes(1));
      expect(ms('6 minutes')).to.equal(time.minutes(6));

      expect(ms('1 hour')).to.equal(time.hours(1));
      expect(ms('5 hours')).to.equal(time.hours(5));

      expect(ms('1 day')).to.equal(time.days(1));
      expect(ms('3 days')).to.equal(time.days(3));

      expect(ms('1 year')).to.equal(time.years(1));
      expect(ms('2 years')).to.equal(time.years(2));
    });
  });
});
