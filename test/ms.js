'use strict';
var ms = require('../lib/ms');

describe('.ms()', function() {
  // Helpers
  var time = {
    minutes: function(n) { return n * 60 * 1000; },
    hours: function (n) { return n * this.minutes(60); },
    days: function(n) { return n * this.hours(24); },
    years: function(n) { return n * this.days(365.25); }
  };
  describe('get a value that less than 1 second', function() {
    it('should return milliseconds representation', function() {
      ms(200).should.equal('200ms');
      ms(30).should.equal('30ms');
      ms(2000).should.not.equal('2000ms');
    });
  });

  describe('seconds representation', function() {
    it('should return short format', function() {
      ms(2000).should.equal('2s');
    });

    it('should return long format', function() {
      ms(2000, { long: true }).should.equal('2 seconds');
      ms(1000, { long: true }).should.equal('1 second');
      ms(1010, { long: true }).should.equal('1 second');
    });
  });

  describe('minutess representation', function() {
    it('should return short format', function() {
      ms(time.minutes(1)).should.equal('1m');
    });

    it('should return long format', function() {
      ms(time.minutes(1), { long: true }).should.equal('1 minute');
      ms(time.minutes(3), { long: true }).should.equal('3 minutes');
    });
  });

  describe('hours representation', function() {
    it('should return short format', function() {
      ms(time.hours(1)).should.equal('1h');
    });

    it('should return long format', function() {
      ms(time.hours(1), { long: true }).should.equal('1 hour');
      ms(time.hours(3), { long: true }).should.equal('3 hours');
    });
  });

  describe('days representation', function() {
    it('should return short format', function() {
      ms(time.days(1)).should.equal('1d');
    });

    it('should return long format', function() {
      ms(time.days(1), { long: true }).should.equal('1 day');
      ms(time.days(3), { long: true }).should.equal('3 days');
    });
  });

  describe('Getting string value', function() {
    it('should return the milliseconds representation(Number)', function() {
      ms('1 second').should.equal(1000);
      
      ms('1 minute').should.equal(time.minutes(1));
      ms('6 minutes').should.equal(time.minutes(6));

      ms('1 hour').should.equal(time.hours(1));
      ms('5 hours').should.equal(time.hours(5));

      ms('1 day').should.equal(time.days(1));
      ms('3 days').should.equal(time.days(3));

      ms('1 year').should.equal(time.years(1));
      ms('2 years').should.equal(time.years(2));
    });
  });
});
