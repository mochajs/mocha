'use strict';
var ms = require('../../lib/ms');

describe('.ms()', function() {
  // Helpers
  var time = {
    minutes: function(n) {
      return n * 60 * 1000;
    },
    hours: function(n) {
      return n * this.minutes(60);
    },
    days: function(n) {
      return n * this.hours(24);
    },
    years: function(n) {
      return n * this.days(365.25);
    }
  };
  describe('get a value that less than 1 second', function() {
    it('should return milliseconds representation', function() {
      expect(ms(200), 'to be', '200ms');
      expect(ms(30), 'to be', '30ms');
      expect(ms(2000), 'not to be', '2000ms');
    });
  });

  describe('seconds representation', function() {
    it('should return short format', function() {
      expect(ms(2000), 'to be', '2s');
    });
  });

  describe('minutes representation', function() {
    it('should return short format', function() {
      expect(ms(time.minutes(1)), 'to be', '1m');
    });
  });

  describe('hours representation', function() {
    it('should return short format', function() {
      expect(ms(time.hours(1)), 'to be', '1h');
    });
  });

  describe('days representation', function() {
    it('should return short format', function() {
      expect(ms(time.days(1)), 'to be', '1d');
    });
  });

  describe('Getting string value', function() {
    it('should return the milliseconds representation(Number)', function() {
      expect(ms('1 second'), 'to be', 1000);

      expect(ms('1 minute'), 'to be', time.minutes(1));
      expect(ms('6 minutes'), 'to be', time.minutes(6));

      expect(ms('1 hour'), 'to be', time.hours(1));
      expect(ms('5 hours'), 'to be', time.hours(5));

      expect(ms('1 day'), 'to be', time.days(1));
      expect(ms('3 days'), 'to be', time.days(3));

      expect(ms('1 year'), 'to be', time.years(1));
      expect(ms('2 years'), 'to be', time.years(2));
    });
  });
});
